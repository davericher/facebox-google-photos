# Facebox-google-photos

A Tool to rapidly train Facebox using a public Google Photos Album.

## Usage

```TEXT
  Description
    Train Facebox Using Public Google Photos Album

  Usage
    $ facebox-google-photos <name> <albumUrl> <faceboxUrl> [options]

  Options
    -s, --state      Download the State File after training  (default false)
    -v, --version    Displays current version
    -h, --help       Displays this message

  Examples
    $ facebox-google-photos "Dave Richer" https://photos.google.com/somePublicAlbum" "http://facebox:facebox@127.0.0.1:8089"
    $ facebox-google-photos "Dave Richer" https://photos.google.com/somePublicAlbum" "http://facebox:facebox@127.0.0.1:8089" -s
```

## Installation

### Using NPX

```BASH
npx facebox-google-photos [options]
```

### Install Globally

```BASH
npm install -g facebox-google-photos
facebox-google-photos [options]
```

## Upcoming Features

- Seed from local directory
- Command line fed configuration files
- Persist seeded images

## Author

Dave Richer / [davericher@gmail.com](mailto:davericher@gmail.com) ([https://www.dopebuild.com](https://www.dopebuilds.com))
