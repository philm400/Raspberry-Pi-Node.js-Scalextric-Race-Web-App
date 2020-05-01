var timeStart;
var timer;
var raceTimer = 0;

self.onmessage = function(e) {
    if (e.data.function == 'start') {
        timeStart = performance.now();
        splitsL1 = [{raceTime: 0, lapSplit: 0}];
        timer = setInterval(() => {
            var newTime = performance.now();
            raceTimer = newTime - timeStart;                
            self.postMessage({function: 'timer', value: raceTimer});
        }, 3)
    }
    if (e.data.function == 'lap') {
        var prevLapTime = splitsL1[splitsL1.length - 1].raceTime;
        var lap = raceTimer - prevLapTime;
        splitsL1.push({raceTime: raceTimer, lapSplit: lap}); 
        self.postMessage({function: 'lap', value: lap, raceTime:raceTimer, lane: e.data.lane, num: splitsL1.length - 1});
    }
    if (e.data.function == 'stop') {
        splitsL1 = [{raceTime: 0, lapSplit: 0}];
        clearInterval(timer);
    }
    if (e.data.function == 'reset') {
        raceTimer = 0;
        splitsL1 = [{raceTime: 0, lapSplit: 0}];
    }
}