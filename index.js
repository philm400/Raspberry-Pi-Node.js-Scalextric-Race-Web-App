var express = require('express'); // Express.js server object
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
var path = require('path');
var os = require('os');
const chalk = require('chalk');
const Stopwatch = require('./classes/stopwatch.js').Stopwatch // Custom Stopwatch Class
const clock = new Stopwatch();
const pigpio = require('pigpio');
const Gpio = require('pigpio').Gpio;
var bounce1 = 0;
var bounce2 = 0;
const cooloff = 1500000

pigpio.configureClock(10, pigpio.CLOCK_PCM);

const lane1 = new Gpio(23, { // GPIO 23 for Lane 1
      mode: Gpio.INPUT,
      pullUpDown: Gpio.PUD_DOWN,
      edge: Gpio.RISING_EDGE
});
const lane2 = new Gpio(21, { // GPIO 21 for Lane 2
      mode: Gpio.INPUT,
      pullUpDown: Gpio.PUD_DOWN,
      edge: Gpio.RISING_EDGE
});
lane1.glitchFilter(300000); // 30ms stablity time for signal
lane2.glitchFilter(300000); // 30ms stablity time for signal

// Set up the simple Express Server
const PORT_NUM = 3000;
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname,'public'))); // Serve static files to client

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + 'public/index.html')) // Send Index.html on root call
});

http.listen(PORT_NUM, function() {
  var host = os.hostname();
  var port = http.address().port;
  console.clear();
  console.log(' ');
  console.log(chalk.hex('#FFB74D')('   ______   ______  __    __       _____  ______'));
  console.log(chalk.hex('#FFB74D')('  /      \\ /      \\|  \\  |  \\     |     \\/      \\'));
  console.log(chalk.hex('#FFB74D')(' |  ██████\\  ██████\\ ██  | ██      \\█████  ██████\\'));
  console.log(chalk.hex('#FFA726')(' | ██___\\██ ██   \\██\\██\\/  ██        | ██ ██___\\██'));
  console.log(chalk.hex('#FF9800')('  \\██    \\| ██       >██  ██    __   | ██\\██    \\'));
  console.log(chalk.hex('#FB8C00')('  _\\██████\\ ██   __ /  ████\\   |  \\  | ██_\\██████\\'));
  console.log(chalk.hex('#F57C00')(' |  \\__| ██ ██__/  \\  ██ \\██\\__| ██__| ██  \\__| ██'));
  console.log(chalk.hex('#EF6C00')('  \\██    ██\\██    ██ ██  | ██  \\\\██    ██\\██    ██'));
  console.log(chalk.hex('#E65100')('   \\██████  \\██████ \\██   \\██\\██ \\██████  \\██████'));
  console.log(chalk.hex('#009688')(`\nLAN access: http://${host}:${port}/`));
});

io.on('connection', function (socket) {// WebSocket Connection
  console.log('Websocket Open')
  // GPIO LANE 1
  lane1.on('interrupt', (level, tick) => {
    var diff = tick - bounce1
    if ((diff > cooloff) && (level == 1)) { // stop any further interupts for 1.5 seconds (in microseconds)
      bounce1 = tick; // update the tick reference for the next lap
      var sid = sguid(alpha,8)
      if (clock.getRunning()) {
        laptime = clock.lap(1)
        io.emit('lap', {fn:'lap', lane:1, lapTime:parseInt(laptime.lapms), raceTime:parseInt(laptime.raceTime), lapCount:laptime.lapnum, sguid:sid})
            console.table({fn:'lap', lane:1, lapTime:parseInt(laptime.lapms), raceTime:parseInt(laptime.raceTime), lapCount:laptime.lapnum, sguid:sid})
      }
    }
  });
  // GPIO LANE 2
  lane2.on('interrupt', (level, tick) => {
    var diff = tick - bounce2
    if ((diff > cooloff) && (level == 1)) { // stop any further interupts for 1.5 seconds (in microseconds)
      bounce2 = tick; // update the tick reference for the next lap
      var sid = sguid(alpha,8)
      if (clock.getRunning()) {
        laptime = clock.lap(2)
        io.emit('lap', {fn:'lap', lane:2, lapTime:parseInt(laptime.lapms), raceTime:parseInt(laptime.raceTime), lapCount:laptime.lapnum, sguid:sid})
            console.table({fn:'lap', lane:2, lapTime:parseInt(laptime.lapms), raceTime:parseInt(laptime.raceTime), lapCount:laptime.lapnum, sguid:sid})
      }
    }
  });
  // Socket.IO Listen for inbound events
  socket.on('clientFN', (data) => {
    if (data.fn == 'start') {
      clock.start()
    }
    if (data.fn == 'stop') {
      clock.stop()
    }
    if (data.fn == 'lap') {
        if (clock.getRunning()) {
            var sid = sguid(alpha,8)
            laptime = clock.lap(data.lane)
            console.table(laptime)
            io.emit('lap', {fn:'lap', lane:data.lane, lapTime:parseInt(laptime.lapms), raceTime:parseInt(laptime.raceTime), lapCount:laptime.lapnum, sguid:sid})
        }
    }
    console.table(data);
  });
});
var alpha = '0123456789abcdef';
function sguid(alpha, len) {
  var sid = '';
  for (var i = 0; i < len; i++) {
    sid += alpha.charAt(Math.floor(Math.random() * alpha.length));
  }
  return sid;
}

// Cleanup function on exit
function exitApp() {
  console.log('\nCleaning up GPIO...')
  clock.stop();
  io.close();
  console.log('Websocket Closed');
  http.close(() => {
    console.log('Server terminated')
    console.log('\x1b[31m%s\x1b[0m','EXIT');
    process.exit(0); //exit completely
  });
}

// Cleanup event handlers
process.on('SIGTERM', () => {
  exitApp();
});
process.on('SIGINT', () => {
  exitApp();
});