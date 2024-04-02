console.log("Running the processing file for prepared files");
const fs = require('fs');
const path = require('path');
const request = require('request');

const directoryPath = '/home/tom/n3rgy/n3rgy_node/pending_influx';
const files = fs.readdirSync(directoryPath);
console.log(files);


//Read your access token from config.json
let config;
try {
  config = JSON.parse(fs.readFileSync('/home/tom/n3rgy/n3rgy_node/config.json', 'utf-8'));
}catch(error) {
  console.error('Error reading config.json: ', error.message);
  process.exit(1);
}

function processNextFile(index) {
  const file = files[index];
  const filePath = path.join(directoryPath, file);

  fs.readFile(filePath, 'utf8', (err, fileContents) => {
    console.log(`Now processing file ${filePath}`);
    if (err) {
      console.error(`Error reading file ${filePath}: ${err.message}`);
      rl.close();
      return;
    }

    fileContents = JSON.parse(fileContents);

    const endpoint= config.influx_endpoint + "/submit_energy"
    const options = {
      method: 'POST',
      url: endpoint + '/submit_energy',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + config.influx_token,
      },
      body: JSON.stringify(fileContents),
    };

    request(options, (error, response) => {
      if (error) {
        console.error(`Error sending request for file ${filePath}: ${error.message}`);
        return;
      }

      console.log(`Response for file ${filePath}: ${response.body}`);

      // Prompt user for the next file
      const nextIndex = index + 1;
      const nextFileName = nextIndex < files.length ? files[nextIndex] : '';
      if( nextFileName != '' ) {
        processNextFile(nextIndex);      
      }
    });
  });
}

// Start processing the files
processNextFile(0);