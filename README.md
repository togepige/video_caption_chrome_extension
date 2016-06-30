# video caption chrome extension

## Overview
The idea of this extension is to provide a way to load captions for videos from YouTube or other video websites. The extension pull the video information from video page and get the corresponding caption from server, then loads them on the video.

Moreover, it should allow user to make bookmarks, write comments and correct captions in future.

## Requirements
* Node.js
* Grunt-cli: `npm install -g gulp-cli`

## Build
* `cd <project_dir>`
* Run `npm install`
* Run `gulp`

## Some notes
1. If you add some files to public folder or any path not in the grunt watch list, run `gulp` to rebuild again.

## Usage
Currently it is still under development so you can download it and install in Chrome extension page.
After build with `gulp`, load the `build` folder to Chrome Extension.
