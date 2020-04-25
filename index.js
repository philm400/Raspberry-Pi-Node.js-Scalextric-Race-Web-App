var express = require('express'); // Express.js server object
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http) //require socket.io module and pass the http object (server)
var path = require('path');
var os = require('os');

var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var lane1 = new Gpio(23, 'in', 'rising', {debounceTimeout: 100}); //use GPIO pin 21 as input
var lane2 = new Gpio(21, 'in', 'rising', {debounceTimeout: 100}); //use GPIO pin 23 as input
var bounce1 = true;
var bounce2 = true;

const PORT_NUM = 3000

app.set('view engine', 'html');
app.use(express.static(path.join(__dirname,'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + 'public/index.html'))
})


http.listen(PORT_NUM, function() {
  var host = os.hostname();
  var port = http.address().port;

  console.log(' ');
  console.log('\x1b[36m%s\x1b[0m','▄▀▀ ▄▀▀ ▄▀▄ █   ██▀ ▀▄▀ ▀█▀ █▀▄ █ ▄▀▀      █ ▄▀▀');
  console.log('\x1b[36m%s\x1b[0m','▄██ ▀▄▄ █▀█ █▄▄ █▄▄ █ █  █  █▀▄ █ ▀▄▄ ▀▀ ▀▄█ ▄██');
  console.log(' ');
  console.log('LAN access: http://%s:%s', host, port);
});

io.sockets.on('connection', function (socket) {// WebSocket Connection
  var magVal = 0; //static variable for current status
  console.log('Websocket Open')
  lane1.watch(function (err, value) { //Watch for hardware interrupts on lane1 reed sensor
    if (err) { //if an error
      console.error('There was an error', err); //output error message to console
      return;
    }
    if (bounce1 == true) {
      bounce1 = false;
      magVal = value;
      console.log('LANE 1 - Trigger - val: '+magVal)
      socket.emit('lane1', magVal); //send status to client
      setInterval(function(){
        bounce1 = true;
      }, 1000)
    }
  });
});

function exitApp() {
  console.log('\rCleaning up GPIO...')
  lane1.unexport(); // Unexport GPIO to free resources
  lane2.unexport(); // Unexport GPIO to free resources
  io.close();
  console.log('Websocket Closed');
  http.close(() => {
    console.log('Server terminated')
    console.log('EXIT');
    process.exit(0); //exit completely
  });
}

process.on('SIGTERM', () => {
  exitApp();
});
process.on('SIGINT', () => {
  exitApp();
});