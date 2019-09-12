/**
 * Code related to Facebox seeding from Google Photos Album
 */

const rp = require("request-promise-native");
const chalk = require("chalk");
const download = require("image-downloader");
const { GooglePhotos } = require("google-photos-album-image-url-fetch");

/**
 * Train Facebox
 * @param {String} name Name to tag
 * @param {String} album Album to pull
 * @param {String} facebox Instance to train
 */
const train = async (name, album, facebox) => {
  // Get a list of URLS for each Image in a Public Google Photos Album
  const re = await GooglePhotos.Album.fetchImageUrls(album);

  // Build a collection of request promises for each image, to be send to the teach route
  const requests = re.map(x =>
    rp({
      method: "POST",
      uri: `${facebox}/facebox/teach`,
      body: {
        url: x.url,
        id: `${x.uid}.jpg`,
        name: name
      },
      json: true
    }).catch(err => {
      if (err.statusCode === 404) {
        console.error(
          chalk.red(
            `The route you provided for Facebox is not reachable: ${facebox}`
          )
        );
        console.error(
          chalk.red(
            "Make sure you specified the correct URL, and that Facebox is not in read only mode"
          )
        );
        process.exit();
      }
      console.error(
        chalk.red(
          `Issue with ${err.options.body.url}: ${err.error.error ||
            err.message}`
        )
      );
    })
  );

  // Report Totals
  console.log(
    chalk.cyan(`Found a total of ${requests.length} Images in Album ${album}`)
  );

  // Wrap them in a 'All' Wrapper, allowing us to know when they have all completed
  const allRequests = Promise.all(requests);

  // Resolve all the promises, capturing results
  const finalResults = await allRequests;

  // Get a numeric count of total succesfull images procecesed
  const totalSuccessful = finalResults.filter(x => x && x.success).length;

  return {
    finalResults,
    totalSuccessful
  };
};

/**
 * Download the State File
 * @param {string} hostUrl Facebox Host Url
 */
const downloadState = async hostUrl => {
  const { filename } = await download.image({
    url: `${hostUrl}/facebox/state`,
    dest: `${new Date(Date.now()).toISOString()}.facebox`
  });
  return filename;
};

/**
 * Console Handler for: Seed
 * @param {String} name
 * @param {String} albumUrl
 * @param {String} faceboxUrl
 * @param {Object} opts
 */
const handleSeed = async (name, albumUrl, faceboxUrl, opts) => {
  // Train The Album
  console.log(chalk.cyan(`Processing Album ${albumUrl} for ${name}`));
  const results = await train(name, albumUrl, faceboxUrl);
  // Report total succesfully processed
  console.log(
    chalk.green(
      `Processed a total of ${results.totalSuccessful} Images succesfully`
    )
  );
  // Attempt to download the state file
  if (opts.state) {
    console.log(chalk.cyan(`Attempting to download State File`));
    try {
      const filename = await downloadState(faceboxUrl);
      if (!filename) {
        throw new Error("No Filename returned for State File");
      }
      console.log(
        chalk.green(
          `Downloaded the State File to ${process.env.PWD}/${filename}`
        )
      );
    } catch (err) {
      console.error(
        chalk.red(
          `An error occured trying to download the State File: ${err.message}`
        )
      );
    }
  }
};

module.exports = {
  handleSeed,
  train,
  downloadState
};
