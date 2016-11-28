function report() {

  var eventMap = {};
  var containerMap = {};

  var eventsData = getJSON();

  var events = eventsData.events;
  var systemEvents = eventsData.systemEvents;
  var customEvents = eventsData.customEvents;

  document.getElementById("totalEventCount").innerHTML = (systemEvents + customEvents);
  document.getElementById("systemEvents").innerHTML = (systemEvents);
  document.getElementById("customEvents").innerHTML = (customEvents);

  events.forEach(event => {
    addObjectToMap(eventMap, event.eventName, event.container, event);
    addObjectToMap(containerMap, event.container, event.eventName, event);
  });

  renderChart(eventMap,"#eventMapChart");
  renderJSON(eventMap,"eventMapJSON");

  renderChart(containerMap,"#containerMapChart");
  renderJSON(containerMap,"containerMapJSON");


  function addObjectToMap(map, key1, key2, object) {
    if(map[key1] == undefined){
      map[key1] = {};
    }
    if(map[key1][key2] == undefined){
      map[key1][key2] = [];
    }
    map[key1][key2].push(object);
  };

  function renderJSON(json,id) {
    var formatter = new JSONFormatter(json,1);
    document.getElementById(id).appendChild(
      formatter.render()
    );
  };

  function getC3data(object) {
    var newObject = {}, keys = [];
    var keys1 = Object.keys(object);
    keys1.forEach(key1 => {
      var object1 = object[key1];
      var totalNo = 0;
      Object.keys(object1).forEach(key => {
        if(object1 && object1[key] && Array.isArray(object1[key])){
          totalNo += object1[key].length;
        }
      });
      var min = 6;
      if(totalNo < min){
        newObject['other (< '+min+')'] ? newObject['other (< '+min+')']++ : newObject['other (< '+min+')'] =  1;
        keys.indexOf('other (< '+min+')') == -1 ? keys.push('other (< '+min+')') : {};
      }else {
        key1 = key1.replace(/\./g,"_")+ " ("+totalNo+")";
        newObject[key1]= totalNo;
        keys.push(key1);
      }
    });
    return {'keys' : keys, 'data' : newObject}
  };

  function renderChart(object,id){
    var c3Data = getC3data(object);
    var chart = c3.generate({
      bindto: id,
      data: {
          json: [ c3Data.data ],
          keys: {
              value: c3Data.keys,
          },
          type:'pie'
      },
    });

  }
};
