// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

// import socket from "./socket"
import Elm from './main';


//  const elmDiv = document.querySelector('#main');
//  Elm.Main.embed(elmDiv)
const elmDiv = document.getElementById('elm-app');
const app = Elm.Main.embed(elmDiv);

app.ports.send.subscribe(play);

const ctx = new (window.webkitAudioContext || window.AudioContext);

function play(args) {
    let note = args.note;
    let waveType = args.waveType;
    let hz = note.frequency;
    let octave = note.octave / 4;
    let sustain = note.sustain;
    let osc, osc2, osc3, osc4;
    let gainNode, gainNode2, gainNode3, gainNode4;
    // console.log(sustain, octave, hz);
    
    // Oscillator 1
    osc = ctx.createOscillator();
    gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    gainNode.gain.value = 0.0;
    gainNode.gain.setTargetAtTime(0.25, ctx.currentTime, 0.01);
    gainNode.gain.setTargetAtTime(0.00, ctx.currentTime + sustain, 0.01);
    osc.frequency.value = hz * octave;
    osc.type = waveType;
    osc.start();
    osc.stop(ctx.currentTime + sustain + 0.01);

    // Oscillator 2 (Octave Higher)
    osc2 = ctx.createOscillator();
    gainNode2 = ctx.createGain();
    osc2.connect(gainNode2);
    gainNode2.connect(ctx.destination);
    gainNode2.gain.value = 0.0;
    gainNode2.gain.setTargetAtTime(0.15, ctx.currentTime, 0.01);
    gainNode2.gain.setTargetAtTime(0.0, ctx.currentTime + sustain, 0.01);
    osc2.frequency.value = hz * octave * 2;
    osc2.type = waveType;
    osc2.start();
    osc2.stop(ctx.currentTime + sustain + 0.01);

    // // Oscillator 3 (2 Octaves Higher)
    osc3 = ctx.createOscillator();
    gainNode3 = ctx.createGain();
    osc3.connect(gainNode3);
    gainNode3.connect(ctx.destination);
    gainNode3.gain.value = 0.0;
    gainNode3.gain.setTargetAtTime(0.05, ctx.currentTime, 0.01);
    gainNode3.gain.setTargetAtTime(0.0, ctx.currentTime + sustain, 0.01);
    osc3.frequency.value = (hz * octave * 3 + 1) 
    osc3.type ="sine";
    osc3.start();
    osc3.stop(ctx.currentTime + sustain + 0.1);
}