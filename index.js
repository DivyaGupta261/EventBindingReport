/* Server Implementation */

const fs    = require('fs');
const grepr = require('grepr');
const rl    = require('readline-specific');

const directory = 'js/js_4_0/';
const jsFilePath = 'data/data.js';
var lastFileName = directory + "/zoho_intercom.js";

const Events  = require('./event/events');
var events    = new Events();

grepr(".bind(", directory, function(file,lineNumbers,lines){
  lineNumbers.forEach( (lineNumber,i) => {
    var line = lines[i];

    var container = getContainer(line);
    var eventsList = getEventsList(line);

    eventsList.forEach(event => {
      event = event.trim();
      var eventItem = events.createNewEvent(event , container, file, lineNumber, line.replace(/(\t)/gm,""));
      readBlock(file,lineNumber,eventItem);
      if(eventItem.container == "})"){
        getPreviousContainer(file,lineNumber,eventItem)
      }
    });
  });

  if(file == lastFileName){
    fs.writeFileSync( jsFilePath,
                      "function getJSON(){ return "+ JSON.stringify(events,null,4) + "}",
                      'utf-8');
  }
});

function getEventsList(str){
  var eventsList = (str.split('.bind(')[1]).split(',')[0].replace(/\'/g," ").replace(/\"/g," ").trim().split(" ");
  var length = eventsList.length;
  if(eventsList[length-1].startsWith("+") || eventsList[length-1].startsWith(".")){
    eventsList[length-2] = eventsList[length-2].concat(eventsList[length-1]);
    eventsList.splice(length-1,1);
  }
  return eventsList;
}

function getContainer(str) {
  if(str.indexOf('.bind(') > -1){
    str = str.split('.bind(')[0];
  }else if(str.indexOf('.one(') > -1){
    str = str.split('.one(')[0];
  }
  var container = str.replace(/\//g," ").replace(/\*/g, " ").replace(/(\r\n|\n|\r|\t)/gm,"").trim();
  return container;
}

function readBlock(filePath,lineNumber, eventItem) {
  rl.multilines(filePath, [lineNumber+1,lineNumber+2,lineNumber+3,lineNumber+4, lineNumber+5], function(err, res) {
    if (err) console.error(err)
    eventItem.block = Object.keys(res)
                      .reduce((block, lineNumber) => {
                       return  block + res[lineNumber].trim() + "\n";
                      }," ");
    var endOfFunction = eventItem.block.indexOf('})');
    if(endOfFunction){
      //eventItem.block = eventItem.block.substring(0,endOfFunction );
    }
  })
}

function getPreviousContainer(fileName,lineNumber,eventItem) {
  var lineNumbers = [];
  var i = lineNumber > 100 ? lineNumber-100 : 0;
  for(; i<= lineNumber; i++){
    lineNumbers.push(i);
  }

  rl.multilines(fileName, lineNumbers, function(err, res) {
    var lines = res;
    var startingLineNumber = lineNumber > 100 ? lineNumber-100 : 0;
    for(i=lineNumber; i >= startingLineNumber; i-- ){
      if(lines[i] && lines[i].indexOf('.one(') >-1){
        break;
      }
      if(lines[i] && lines[i].indexOf('.bind(') > -1){
        break;
      }
    }
    if(lines[i] && (lines[i].indexOf('.bind(') > -1 || lines[i].indexOf('.one(') > -1)){
      var container = getContainer(lines[i]);
      if(container == "})"){
      //  getPreviousContainer(fileName,i,eventItem)
      }else{
        eventItem.container = container;
      }
    }

  });


}
