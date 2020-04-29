var parser = new DOMParser();

window.addEventListener('load', function() {
    console.log('Page Loaded')
    /* var socket = io(); // Initialise socket.io-client to connect to host
    socket.on('lane1', function (data) { //get button status from client
        //document.querySelecter("#console_lane_1").innerHTML += 'Lane1 - Data: '+data+'<br>';
        console.log('Lane1 - Data: '+data);
    }); */
    //var htmlstring = parser.parseFromString('<div #id="TEST"><a href="#">TEST LINK <span>&gt;&gt;</span></a></div>', 'text/html');
    //document.querySelector('#ui-top .col').append(htmlstring.body.firstChild);
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
        this.results.appendChild(li.body.firstChild);
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
        // Hundredths of a second are 100 ms
        this.times[2] += diff;
        // Seconds are 100 hundredths of a second
        if (this.times[2] >= 1000) {
            this.times[1] += 1;
            this.times[2] -= 1000;
        }
        // Minutes are 60 seconds
        if (this.times[1] >= 60) {
            this.times[0] += 1;
            this.times[1] -= 60;
        }
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
<span class="mil">${pad0(Math.floor(times[2]), 3)}</span>`;
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