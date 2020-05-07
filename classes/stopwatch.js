const {performance} = require('perf_hooks')

class Stopwatch {
    constructor() {
        this.running = false;
        this.timeStart;
        this.timer;
        this.raceTimer = 0;
        this.splitsL1 = [{raceTime: 0, lapSplit: 0}];
        this.splitsL2 = [{raceTime: 0, lapSplit: 0}];
    }

    start() {
        this.running = true;
        this.timeStart = performance.now();
        this.splitsL1 = [{raceTime: 0, lapSplit: 0}];
        this.splitsL2 = [{raceTime: 0, lapSplit: 0}];
        this.timer = setInterval(() => {
            var newTime = performance.now();
            this.raceTimer = newTime - this.timeStart;
        }, 3)
    }
    lap(lane) {
        if (this.running) {
            var prevLapTime = (lane == 1) ? this.splitsL1[this.splitsL1.length - 1].raceTime : this.splitsL2[this.splitsL2.length - 1].raceTime;
            var lap = this.raceTimer - prevLapTime;
            if (lane == 1) {
                this.splitsL1.push({raceTime: this.raceTimer, lapSplit: lap});
                return {lapms:lap, lapnum:this.splitsL1.length - 1, raceTime:this.raceTimer};
            } else {
                this.splitsL2.push({raceTime: this.raceTimer, lapSplit: lap}); 
                return {lapms:lap, lapnum:this.splitsL2.length - 1, raceTime:this.raceTimer};
            }
        }
    }
    stop() {        
        this.running = false;
        clearInterval(this.timer);
        this.reset();
    }
    reset() {
        this.raceTimer = 0;
    }
    getRunning() {
        return this.running;
    }
}

module.exports = {Stopwatch: Stopwatch};