const fs = require('fs');
const path = require('path');
const request = require('request');
const readline = require('readline');

const directoryPath = '/home/tom/n3rgy_node/pending_influx';
const files = fs.readdirSync(directoryPath);
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//Read your access token from config.json
let config;
try {
  config = JSON.parse(fs.readFileSync('/home/tom/n3rgy_node/config.json', 'utf-8'));
}catch(error) {
  console.error('Error reading config.json: ', error.message);
  process.exit(1);
}

function processNextFile(index) {
  if (index === files.length) {
    rl.close();
    console.log('All files processed.');
    return;
  }

  const file = files[index];
  const filePath = path.join(directoryPath, file);

  fs.readFile(filePath, 'utf8', (err, fileContents) => {
    if (err) {
      console.error(`Error reading file ${filePath}: ${err.message}`);
      rl.close();
      return;
    }

    fileContents = JSON.parse(fileContents);

    const options = {
      method: 'POST',
      url: 'http://192.168.68.68:52525/submit_energy',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + config.bearer_token,
      },
      body: JSON.stringify(fileContents),
    };

    request(options, (error, response) => {
      if (error) {
        console.error(`Error sending request for file ${filePath}: ${error.message}`);
        rl.close();
        return;
      }

      console.log(`Response for file ${filePath}: ${response.body}`);

      // Prompt user for the next file
      const nextIndex = index + 1;
      const nextFileName = nextIndex < files.length ? files[nextIndex] : '';
      rl.question(`Enter next file name (or press Enter to finish): `, (userInput) => {
        const nextInput = userInput.trim() || nextFileName;
        if (nextInput === '') {
          rl.close();
          console.log('All files processed.');
        } else {
          // Process the next file recursively
          processNextFile(nextIndex);
        }
      });
    });
  });
}

// Start processing the files
processNextFile(0);