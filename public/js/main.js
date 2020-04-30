var parser = new DOMParser();
var options = {
    laps: 10,
    player1: '',
    player2: ''
};

const bkg = document.querySelector('#bkg');
const ui = document.querySelector('#ui-wrap');
const newg = document.querySelector('#newGame');
const newgpanel = document.querySelector('.name-game-panel');
const lapOption = document.querySelector('#i-num-laps');
const p1 = document.querySelector('#i-player1');
const p2 = document.querySelector('#i-player2');
const logo = document.querySelector('#logo');
const startBtn = document.querySelector('#enter-game-btn');

window.addEventListener('load', function() {
    console.log('Page Loaded')
    /* var socket = io(); // Initialise socket.io-client to connect to host
    socket.on('lane1', function (data) { //get button status from client
        //document.querySelecter("#console_lane_1").innerHTML += 'Lane1 - Data: '+data+'<br>';
        console.log('Lane1 - Data: '+data);
    }); */
    //var htmlstring = parser.parseFromString('<div #id="TEST"><a href="#">TEST LINK <span>&gt;&gt;</span></a></div>', 'text/html');
    //document.querySelector('#ui-top .col').append(htmlstring.body.firstChild);

    logo.addEventListener('animationend', showStart);
    function showStart() {
        startBtn.classList.add('on');
        logo.removeEventListener('animationend', showStart);
    }
});

// Stopwatch Class - Derived from  https://codepen.io/_Billy_Brown/pen/dbJeh
class Stopwatch {
    constructor(display, results) {
        this.running = false;
        this.display = display;
        this.results = results;
        this.time = 0;
        this.reset();
    }    
    reset() {
        this.stop();
        this.times = [ 0, 0, 0 ];
        this.outputClock(this.times);
        this.clear();
    }    
    start() {
        this.runtime = 0;
        this.time = performance.now();
        this.splitsL1 = [{raceTime: this.runtime, lapSplit: 0, animTotal: this.time}]; // time,split,TimeSinceAnimPain
        this.splitsL2 = [{raceTime: this.runtime, lapSplit: 0, animTotal: this.time}];
        if (!this.running) {
            this.running = true;
            requestAnimationFrame(this.step.bind(this));
        }
    }    
    lap(lane) {
        var lapElement = () => `<li class="lap">
                                    <span class="lapNum">${lapNum}</span>
                                    <span class="lapTime">${fdiff}</span>
                                    <span class="raceTime">${fruntime}</span>
                                    <span class="fastestLap">Fastest Lap</span>
                                </li>`;
        var lapNum = this.splitsL1.length;
        var prevTime = this.splitsL1[this.splitsL1.length - 1].animTotal;
        var diff = this.time - prevTime;
        var fdiff = this.calculateTime(diff,'lap'); // formatted for output
        var fruntime = this.calculateTime(this.runtime);// formatted for output
        this.splitsL1.push({raceTime: this.runtime, lapSplit: diff, animTotal: this.time}); // .push() new lap time and split diff times as an array
        let times = this.times;
        let li = parser.parseFromString(lapElement(), 'text/html');
        this.results.prepend(li.body.firstChild);
    }    
    stop() {
        this.running = false;
        this.time = null;
    }   
    clear() {
        clearChildren(this.results);
    }    
    step(timestamp) {
        if (!this.running) return;
        this.calculateClock(timestamp);
        this.time = timestamp;
        this.outputClock();
        requestAnimationFrame(this.step.bind(this));
    }    
    calculateClock(timestamp, ) {
        var diff = timestamp - this.time;
        this.runtime += diff;
        var timeObj = new Date(this.runtime).toISOString().slice(14, -1);
        this.times = timeObj.split(/[:.]+/);
    }  
    calculateTime(timestamp, type = 0) {
        var cut = (type == 'lap') ?  17 : 14;
        return new Date(timestamp).toISOString().slice(cut, -1);
    }  
    outputClock() {
        this.display.innerHTML = this.formatClock(this.times);
    }    
    formatClock(times) {
        return `\
<span class="min">${pad0(times[0], 2)}</span>:\
<span class="sec">${pad0(times[1], 2)}</span>:\
<span class="mil">${pad0(Math.round(times[2]), 2)}</span>`;
    }
}

function pad0(value, count) { // Add leading 0's when required
    count = count || 2;
    return ('00' + value).slice(-count);
}
function clearChildren(node) {
    while (node.lastChild)
        node.removeChild(node.lastChild);
}

let stopwatch = new Stopwatch(
    document.querySelector('#timer_lane_1'),
    document.querySelector('#console_lane_1'));

function raceOptions() { // handle button event to show New Game panel
    bkg.classList.add('blurUI-20');
    ui.classList.add('opacityUI-clear');
    bkg.addEventListener('animationend', handleAnimationEnd);

    function handleAnimationEnd() {
        newg.classList.add('flex');
        newgpanel.classList.add('UIReveal');
        bkg.removeEventListener('animationend', handleAnimationEnd);
    }
}
function closeOptions() { // handle button event to show New Game panel
    newgpanel.classList.add('UIExit');
    newgpanel.addEventListener('animationend', handleAnimationEnd);
    function handleAnimationEnd() {
        newg.classList.remove('flex');
        newgpanel.classList.remove('UIExit','UIReveal');
        bkg.classList.add('reverse-blurUI-20');
        bkg.classList.remove('blurUI-20');
        ui.classList.add('reverse-opacityUI-clear');
        ui.classList.remove('opacityUI-clear');

        ui.addEventListener('animationend', handleAnimationEnd2);
        function handleAnimationEnd2() {
            bkg.classList.remove('reverse-blurUI-20');
            ui.classList.remove('reverse-opacityUI-clear');
            ui.removeEventListener('animationend', handleAnimationEnd2);
        }

        newgpanel.removeEventListener('animationend', handleAnimationEnd);
    }
}

function addLap() {
    var laps = parseInt(lapOption.value) + 1;
    lapOption.value = laps;
}
function minLap() {
    var laps = parseInt(lapOption.value) - 1;
    var newLaps = (laps < 0) ?  0 : laps;
    lapOption.value = newLaps;
}
function saveOptions() {
    options.laps = lapOption.value;
    options.player1 = p1.value;
    options.player2 = p2.value;
    console.table(options);
    closeOptions();
}
function enterGame() {
    startBtn.classList.remove('on');

    setTimeout(() => {
        bkg.classList.remove('op-25');
        logo.classList.add('in-game');
        ui.classList.remove('hidden');
        ui.classList.add('reverse-opacityUI-clear');
        ui.addEventListener('animationend', handleAnimationEnd2);
        function handleAnimationEnd2() {
            ui.classList.remove('reverse-opacityUI-clear');
            ui.removeEventListener('animationend', handleAnimationEnd2);
        }
    }, 500);
}