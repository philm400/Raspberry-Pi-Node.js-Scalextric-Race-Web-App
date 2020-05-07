# Raspberry Pi Node.js Scalextric Race Engine
This a software/hardware project to build a custom Scalextric race engine accessible via a modern browser for display on screen capable of 1080p output.

Mobile and tablet device support will be added in future releases.

The Node.js project is inspired by a similar project I did a few years back based on Python 3 on the RPi using the basic TKinter UI library. It got the job done but wasn't great to look at.

That originial itself started after my son got a Scalextric Sport set with the Arc One base plate that connects to a mobile app via bluetooth. It's not bad, the Android App is 'OK' but the visual fun is limited when you are looking at a small 5" phone screen to see your laps time or who is leading the race.

I thought I could do better and make a full screen race control dashboard using the Pi, some small Reed sensors and a little JS magic.

This new platform is built on top of a simple Node.js/Express server with a Websocket provided by socket.IO and the pigio module to access the GPIO of the Raspberry Pi.

I've also upgrade the UI to use modern CSS to create better visuals and interaction, giving it a more game-like feel.

## Pre-requisities:
* Raspberry Pi 3/3b/4/4b (other Pi's may work but are untested)
* Breadboard + wires etc...
* 1KΩ and 10KΩ resistors
* 2 Reed sensors - Small Sealed / pre-wired ones are best like these: http://ebay.eu/2kwWhZ7
* [Node.js](https://www.w3schools.com/nodejs/nodejs_raspberrypi.asp) (I'm using 12.x LTS)
* [Express](https://expressjs.com/) 
* [socket.io](https://www.npmjs.com/package/socket.io) for Node.js
* [pigpio](https://www.npmjs.com/package/pigpio) library for Node.js
* Scalextric Track
* 2 Slot cars with Magnatraction (magnets on the chasis)

## Installation (on RPi)
Assuming you already have Node.js installed, download the source files to your local dev environment on your Raspberry Pi.
In the terminal navigate to the folder containing the package.json file using cd {folder/path} and run the command:
```
npm install
```
This will install of the dependancies required.

## Running the application
Again from the terminal in the same folder run following command to start Node.js and start serving the application on port 3000.
```
sudo node index.js
```
>  **Note: the pigpio module requires you to run Node.js as sudo to enable permission and access to the GPIO**


From another device i.e. a laptop or desktop machine on the same network, you should be able access the Node.js server using a URL reference such as: 

```
http://raspberrypi:3000
```

Where 'raspberrypi' will be the hostname of your of RPi device (is using Raspbian this is found in Preferences > Raspberry Pi Configuration)

## Raspberry Pi Fritzing diagram
![Fritzing](https://raw.githubusercontent.com/philm400/Raspberry-Pi-Python-Scalextric-Lap-Timer/master/docs/img/Scalextric-Reed-Swtichs_diagram.png?raw=true)
