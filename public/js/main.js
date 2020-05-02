var parser = new DOMParser();
var options = {
    laps: 10,
    player1: '',
    player2: '',
    fastest: 99999999,
    times: {
        lane1: [],
        lane2: []
    }
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
    updateTimer(new Date(0).toISOString().slice(14, 21));
     
    logo.addEventListener('animationend', showStart);
    function showStart() {
        startBtn.classList.add('on');
        logo.removeEventListener('animationend', showStart);
    }
});

const timerEl = document.querySelector("#timer_lane_1");
const lapsLane1 = document.querySelector("#console_lane_1");
const lapsLane2 = document.querySelector("#console_lane_2");
var parser = new DOMParser();
var worker = new Worker('/js/timer-worker.js'); // Threaded JS Worker

worker.onmessage = function(e) {
    if(e.data.function == 'timer') {
        updateTimer(new Date(e.data.value).toISOString().slice(14, 21));
    }
    if(e.data.function == 'lap') { // data.function, data.value, data.raceTime, data.lane, data.num
        var lapElement = () => `<li class="lap"><div>
                                    <span class="lapNum">${e.data.num}</span>
                                    <span class="lapTime">${diff}</span>
                                    <span class="raceTime">${runtime}</span>
                                    <span class="fastestLap">Fastest Lap</span></div>
                                </li>`;
        diff = new Date(e.data.value).toISOString().slice(17, -1);   
        runtime = new Date(e.data.raceTime).toISOString().slice(14, -1);            
        let li = parser.parseFromString(lapElement(), 'text/html');
        var fastestLap = document.querySelector('.fastest');
        if (e.data.lane == 1) {
            lapsLane1.prepend(li.body.firstChild);
            console.log(e.data.value);
            if (e.data.value < options.fastest) { // Handle fastest lap logic
                options.fastest = e.data.value;
                if (fastestLap !== null) {
                    fastestLap.classList.remove('fastest');
                }
                lapsLane1.firstChild.classList.add('fastest');
            }
        } else if (e.data.lane == 2) {
            lapsLane2.prepend(li.body.firstChild); 
            if (e.data.value < options.fastest) { // Handle fastest lap logic
                options.fastest = e.data.value;
                if (fastestLap !== null) {
                    fastestLap.classList.remove('fastest');
                }
                lapsLane2.firstChild.classList.add('fastest');
            }
        }                 
    }
}
function updateTimer(time) {
    timerEl.innerHTML = time;
}
function startRace() {
    worker.postMessage({function: 'start'}); // Start the timer in worker.
}
function stopRace() {
    worker.postMessage({function: 'stop'}); // Stop the timer in worker.
}
function resetRace() {
    worker.postMessage({function: 'reset'}); // reset the timer in worker.
    updateTimer(new Date(0).toISOString().slice(14, 21));
    lapsLane1.innerHTML = '';
    lapsLane2.innerHTML = '';
    worker.postMessage({function: 'reset'}); // reset the race.
}
function lapTime(l) {
    worker.postMessage({function: 'lap', lane: l}); // Stop the timer in worker.
}



/* Functions below are UI interaction related  */

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

/* OPTIONS FUNCTIONS */
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