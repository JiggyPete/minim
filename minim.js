var midi, data;

if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess({
      sysex: false
  }).then(onMIDISuccess, onMIDIFailure);
} else {
  alert("No MIDI support in your browser.");
}

function onMIDISuccess(midiAccess) {
  midi = midiAccess;

  var inputs = midi.inputs.values();
  for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
    input.value.onmidimessage = minimInput;
  }

  setupBrowserToController(midi.outputs);
}

function onMIDIFailure(error) {
  console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + error);
}

function minimInput(message) {
  console.log(message.data)

  updateBrowserPads(message.data);
}

function updateBrowserPads(midiData) {
  if(midiData[0] == 176) {
    document.getElementById("minim__slider").textContent = midiData[2]
    return
  }

  var element = document.getElementById(midiData[1])
  if(element != null) {
    element.style.backgroundColor = colorFor(midiData[2]);
  }
}

function colorFor(number) {
  return number == 0 ? "white" : "orange";
}

function setupBrowserToController(outputs) {
  outputs.forEach( function(output) {
    output.open();
    listenForEventOn(output, allBrowserPads(), "mousedown", 127);
    listenForEventOn(output, allBrowserPads(), "mouseup", 0);
  })
}

function allBrowserPads() {
  return [2,3,4,5,6,    32, 33, 34, 35, 36, 37, 38, 39 ,40, 41, 42, 43, 44, 45, 46, 47].map( browserPad );
}

function browserPad(id) {
  return document.getElementById(id)
}

function listenForEventOn(output, elements, eventName, padVelocity) {
  elements.forEach( function(element) {
    element.addEventListener(eventName, function(event) {
      var padId = event.srcElement.id;
      var midiData = [144, padId, padVelocity];
      output.send(midiData);
      updateBrowserPads(midiData);
    })
  })
}
