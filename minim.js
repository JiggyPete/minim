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
}

function onMIDIFailure(error) {
  console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + error);
}

function minimInput(message) {
  var element = document.getElementById(message.data[1])
  if(element != null) {
    element.style.backgroundColor = colorFor(message.data[2]);
  }
}

function colorFor(number) {
  return number == 0 ? "white" : "orange";
}
