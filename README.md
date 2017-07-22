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

npm start
```

The application starts listening at specified port.


### Configuration ###

* phantomjsPath: Path to the PhantomJS binary, ex:"..\\bin\\phantomjs.exe",
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
    "height": 1080,
    "agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0",
    "explainRoles: false
}
```

Response:
```
#!javascript
{
    "success": true,
    "renderingTime": 3358,
    "segmentationTime": 104,
    "reasoningTime": 500,
    "result": {
        "tagName": "BODY",
        "xpath": "BODY",
        "role": "Body",
        "name": "VB.1",
        "children": [
            ...
        ],
        "doc": 4
    }
}
```

### Running Unit Tests ###

```
#!javascript

npm install mocha -g
npm test
```

### Updating rules ###

In this project, we use node-rules module as a rule engine to detect roles. This library enables to load defined rules from a text file. 
After modifying the rules in rule-generator.js, following command creates rules.txt to be used in rule engine implementation:

```
#!bash

node rule-generator.js > rules.txt
```

A rule has a condition and a consequence. The condition checks whether an attribute of the block matches the requirement of a role.
The consequence increments the score of the role by a value specific to role and attribute.

```
#!javascript
{
	"condition" : function(R) {
		R.when(this.attribute === 0);
	},
	"consequence" : function(R) {
		this.roles['Header'] += 1;
		R.stop();
	},
	"priority" : 4
}
```