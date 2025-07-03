const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const http = require('http');
const bodyParser = require("body-parser");
const app = express();
const { Server } = require("socket.io");
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
require("dotenv").config();
const os = require('os');

// Function to get local network IP address
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost'; // fallback
}

let arduinoPort
let parser
if (process.env.ARDUINO=='true'){
  arduinoPort = new SerialPort({
    path: 'COM5',
    baudRate: 9600,
  });
  parser = arduinoPort.pipe(new ReadlineParser({ delimiter: '\n' }));
}


// Serve Cordova browser build
app.use(express.static(path.join(__dirname, 'public')));

// set views
app.set('views', path.join(__dirname, '/public/'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(cors());

app.use(bodyParser.json());

app.get('/expNOW', function (request, response) {
  response.render('experiment.html');
});

app.get('/', function (request, response) {
  response.render('welcome.html');
});

app.get('/api/getEnv', (req, res) => {
  return res.json({CONTEXT: process.env.CONTEXT, ARDUINO: process.env.CONTEXT})
});

app.head('/api/uploadData', (req, res) => {
  // You can still set headers/status
  res.status(200).end(); // .end() with no body
});

app.post('/postData', (req, res) => {
  var responseStatus='failure'
  var uploadedData=req.body?.data
  const targetPath=localPaths['trials']
  if (!fs.existsSync(targetPath)) {
    fs.writeFile(targetPath, JSON.stringify(uploadedData, null, 2), (err) => {
      if (err) {
        return console.error('Error writing JSON:', err);
      }
    });
    responseStatus='success'
    console.log(`Successfully wrote first trials to ${targetPath}`)
  } else {
    fs.readFile(targetPath, 'utf8', (err, jsonData) => {
      if (err) {
        console.error('Error reading file:', err);
        return;
      }
      try {
        let jsonArray = JSON.parse(jsonData);
        jsonArray = jsonArray.concat(uploadedData);
        fs.writeFile(targetPath, JSON.stringify(jsonArray, null, 2), (err) => {
          if (err) {
            console.error('Error writing file:', err);
          } else {
            console.log(`Successfully added trials ${uploadedData.map(item=>item.trial_idx)}`)
          }
        });
        responseStatus='success'
      } catch (parseErr) {
        console.error('Error parsing JSON:', parseErr);
      }
    });
  }
  res.status(200).send({ message: responseStatus });
});

// Start HTTPS server
const serverhttp =http.createServer(app).listen(process.env.PORT, () => {
  const address = serverhttp.address();
  const host = address.address === '::' ? 'localhost' : address.address;
  const localIp = getLocalIpAddress();
  console.log(`HTTP server running at:`);
  console.log(`- http://${host}:${address.port} (localhost)`);
  console.log(`- http://${localIp}:${address.port} (local network)`);
});

///////////////////////////////////////////////////////////
///// LOCAL EXPERIMENT : SOCKET + SERIAL COMMUNICATION
//////////////////////////////////////////////////////////
/*
When the experiment is run locally (e.g. in the lab), it will
often be associated with some physiological measurements
These measurements need to be recorded and synchronized with
the behavioral experiment.
Most neuroimaging devices (EEG,MEG,MRI, etc) and physiological 
apparatuses will either communicate directly over USB/serial ports
or send synchronization signals through such ports.
Therefore we use our server to harvest serial data.
We combine this serial data recording with a socket that allows 
real-time communication with our behavioral experiment.
This is required to synchronize the behavioral data with neuro/physio
signals.
*/
var localPaths={
};
var allowWrite=false
const logDir='logfiles'
const io = new Server(serverhttp, {
  cors: {
    origin: [
      `https://192.168.1.41:${process.env.PORT}`,
      `http://localhost:${process.env.PORT}`,
    ],
    methods: ["GET", "POST"],
  },
});
// manage input data from socket
io.on("connection", (socket) => {
  socket.on("expdef", (expdef,ack) => {
    console.log(expdef)
    localPaths.subjectLogDir = path.join(logDir,expdef.subjectId);
    fs.mkdir(localPaths.subjectLogDir, { recursive: true }, (err) => {
      if (err) {
        return console.error('Failed to create directory:', err);
      } else {
        localPaths.expdef=path.join(localPaths.subjectLogDir,`${expdef.subjectId}_expdef.json`)
        localPaths.stimdef=path.join(localPaths.subjectLogDir,`${expdef.subjectId}_stimdef.json`)
        localPaths.progress=path.join(localPaths.subjectLogDir,`${expdef.subjectId}_progress.json`)
        localPaths.trials=path.join(localPaths.subjectLogDir,`${expdef.subjectId}_trials.json`)
        if (process.env.ARDUINO=='true'){
          localPaths.gsr=path.join(localPaths.subjectLogDir,`${expdef.subjectId}_gsr.csv`)
          localPaths.hb=path.join(localPaths.subjectLogDir,`${expdef.subjectId}_hb.csv`)
          localPaths.sync=path.join(localPaths.subjectLogDir,`${expdef.subjectId}_sync.csv`)
          fs.writeFileSync(localPaths.gsr, 'arduinoMS,gsrValue\n');
          fs.writeFileSync(localPaths.hb, 'arduinoMS\n');
          fs.writeFileSync(localPaths.sync, 'arduinoMS,experimentMS\n');
          allowWrite=true
        }
      }
      // start physiological acquisition
      if (process.env.ARDUINO=='true'){
        // Buffers
        let gsrBuffer = [];
        // Parse serial data
        parser.on('data', (line) => {
          line = line.trim();
          if (!allowWrite){
            return
          }
          if (line.startsWith('GSRms')) {
            const parts = line.split(',');
            if (parts.length >= 4) {
              const arduinoMS = parts[1];
              const value = parts[3];
              gsrBuffer.push(`${arduinoMS},${value}`);
            }
          } else if (line.startsWith('HBms')) {
            const parts = line.split(',');
            if (parts.length >= 2) {
              const arduinoMS = parts[1];
              socket.emit("beat", "I am beating")
              fs.appendFile(localPaths.hb, `${arduinoMS}\n`, (err) => {
                if (err) console.error('Error writing HB data:', err);
              });
            }
          } else if (line.startsWith('SYNCms')) {
            const parts = line.split(',');
            if (parts.length >= 2) {
              const arduinoMS = parts[1];
              if (socket) {
                socket.emit("syncRequest", { arduinoMS }, (response) => {
                  const experimentMS=response.experimentMS;
                  fs.appendFile(localPaths.sync, `${arduinoMS},${experimentMS}\n`, (err) => {
                    if (err) console.error('Error writing SYNC data:', err);
                  });
                });
              }
            }
          }
        });
        // Flush Arduino buffers every second
        setInterval(() => {
          if (gsrBuffer.length > 0) {
            fs.appendFile(localPaths.gsr, gsrBuffer.join('\n') + '\n', (err) => {
              if (err) console.error('GSR write error:', err);
            });
            gsrBuffer = [];
          }
        }, 1000); // Adjust interval as needed
      }
      ack({status: "start"})
    });
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
