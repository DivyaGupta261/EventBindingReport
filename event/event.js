

var Event = function (eventName , container, file,lineNumber, line, block, type) {
    this.eventName = eventName;
    this.container = this.getContainer(container);
    this.file = file;
    this.lineNumber = lineNumber;
    this.line = line;
    this.block = block;
    var systemEvents = ["click","keydown","keyup","mousedown","mouseup","mouseover","mouseout","resize"];
    this.type = (systemEvents.indexOf(eventName) > -1) ? "System" :  "Custom";
};

Event.prototype.getContainer = function (container) {
  if(container.indexOf("doc") > -1)
    return "document";
  if(container.indexOf("slidecontainer") >-1 || container.indexOf("slideContainer") >-1 )
    return "slideContainer";
  if(container.indexOf("drawContainer") >-1 )
    return "drawContainer";
  if(container.indexOf("elem") >-1 || container == "ele")
    return "element";
  if(container.indexOf("_container") >-1 )
    return "container";
  return container;
};

module.exports = Event;
