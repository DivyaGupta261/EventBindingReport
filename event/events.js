const Event = require('./event');

var Events = function () {
    this.events = [];
    this.systemEvents = 0;
    this.customEvents = 0;
};

Events.prototype.addNewEvent = function (event) {
  this.events.push(event);
  return event;
};

Events.prototype.createNewEvent = function (name , container, file,lineNumber, line, block, type) {
  var event = this.addNewEvent( new Event(name , container, file,lineNumber, line, block, type));
  (event.type == "System") ? this.systemEvents++ : this.customEvents++;
  return event;
};

module.exports = Events;
