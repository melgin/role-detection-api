# README #

This project aims to develop an API to segment web pages into visual blocks and detect the roles of these blocks based on heuristic roles.

### Installation ###

To install NodeJS dependencies, use npm with following command:

```
#!bash

npm install
```

It will download all modules. Then, start the application as follows:

```
#!bash

node index.js
```

The application starts listening at specified port.


### Configuration ###

* phantomjsPath: Path to the PhantomJS binary, ex:"..\\bin\\phantomjs.exe",
* takeScreenshot: An option for saving the screenshot of the web page with visual blocks highlighted as a JPG file (true/false).
* port: The port which application listens the requests, ex:8080

### Dependencies ###

Project depends on PhantomJS and several NodeJS packages. PhantomJS should be downloaded at http://phantomjs.org/ and binary path should be set in config file. Npm handles NodeJS dependencies.

### Sample API Call ###

Request:
```
#!javascript

POST http://localhost:8080/
{
    "url":"http://elginakpinar.com",
    "width": 1920,
    "height": 1080
}
```

Response:
To be determined

### Running Unit Tests ###

```
#!javascript

npm install mocha -g
mocha tests --recursive
```