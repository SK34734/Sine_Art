const color_picker = document.getElementById('color');
const input = document.getElementById('input');
const vol_slider = document.getElementById('vol-slider');
const line_thickness = document.getElementById('line-thickness');

var interval = null;
var reset = false;

var timepernote = 0;
var length = 0;

// create web audio api elements
const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();


// create Oscillator node
const oscillator = audioCtx.createOscillator();
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
oscillator.type = "sine";

oscillator.start();
gainNode.gain.value = 0;

//define canvas variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d"); //-> the “ctx” is just the part of the canvas that we draw on. Think of it like the “screen”, or the first sheet of paper in a stack. It’s just the face of the whole canvas.
var width = ctx.canvas.width;
var height = ctx.canvas.height;

notenames = new Map();
notenames.set("C", 261.6);
notenames.set("D", 293.7);
notenames.set("E", 329.6);
notenames.set("F", 349.2);
notenames.set("G", 392.0);
notenames.set("A", 440);
notenames.set("B", 493.9);

// go through all the functions if website still doesnt end up working, compare to demo site
function frequency(pitch) {
    freq = pitch / 10000;

    gainNode.gain.setValueAtTime(vol_slider.value, audioCtx.currentTime);
    setting = setInterval(() => {gainNode.gain.value = vol_slider.value}, 1);
    oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
    setTimeout(() => { clearInterval(setting); gainNode.gain.value = 0; }, ((timepernote)-10));
}

function handle() {
    reset = true;
    audioCtx.resume();
    gainNode.gain.value = 0;
    var usernotes = String(input.value);
    var noteslist = [];

    length = usernotes.length;
    timepernote = (6000 / length);

    for (i = 0; i < usernotes.length; i++) {
        noteslist.push(notenames.get(usernotes.charAt(i)))
    }

    let j = 0;
    repeat = setInterval(() => {
        if (j < noteslist.length) {
            frequency(parseInt(noteslist[j]));
            drawWave();
            j++
        } else {
            clearInterval(repeat)
        }


    }, timepernote) // use timepernote instead of 1000 if it doesnt work


    //frequency(input.value); // plays the direct numbers (440, 500, etc)
    drawWave();
}

var counter = 0;
function drawWave() {
    clearInterval(interval);
    if (reset) {
        ctx.clearRect(0, 0, width, height);
        x = 0;
        y = height/2;
        ctx.moveTo(x, y);
        ctx.beginPath();
    }

    counter = 0;
    interval = setInterval(line, 20);
    reset = false;
}

function line() {
    y = height/2 + (((vol_slider.value/100)*40) * Math.sin(x * 2 * Math.PI * freq * (0.5 * length)));
    ctx.strokeStyle = color_picker.value;
    //ctx.lineWidth = line_thickness;
    line_thickness.addEventListener('input', () => {
        ctx.lineWidth = parseInt(line_thickness.value);
    });
    ctx.lineTo(x, y);
    ctx.stroke();
    x = x + 1;

    counter++;

    if(counter > (timepernote/20)) {
        clearInterval(interval);
    }
}