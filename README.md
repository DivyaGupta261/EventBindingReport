To run :
-------

$ npm install
$ npm start

Open index.html


How it works :
-------------

1. Node reads all the js files from the directory mentioned in the 'directory' variable in 'index.js'
2. It greps '.bind(' from the files and forms a event model.
2. The 'data.js' is populated with the json of the event models.
3. The front end code reads from the data.js and renders the chart in the html.

To be done :
-----------

1. Find a way to skip 'min' files and 'jQuery' files while parsing.
2. End call back for grepr (or) find lastFileName.
