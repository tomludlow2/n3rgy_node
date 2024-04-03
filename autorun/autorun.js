//Autorun - to collect the most recent data from n3rgy and push this into the system. 
const fs = require('fs');
const path = require('path');

//First clear all the directories for matching files
function clear_directory(directory_path) {
  // Get a list of all files in the directory
  const files = fs.readdirSync(directory_path);

  // Remove each file in the directory
  files.forEach((file) => {
    const filePath = path.join(directory_path, file);
    fs.unlinkSync(filePath);
    console.log(`Removed: ${filePath}`);
  });

  console.log('Directory cleared.');
}

clear_directory("/home/tom/n3rgy/n3rgy_node/reports");
clear_directory("/home/tom/n3rgy/n3rgy_node/pending_influx");

const fetcher = require("/home/tom/n3rgy/n3rgy_node/functions/get_for_date_range.js");

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}`;
}

function getLastNDaysFormattedDates(n) {
  const today = new Date();
  const formattedDates = [];

  for (let i = 0; i < n; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() - i);
    formattedDates.unshift(formatDate(currentDate)); // Add to the beginning of the array
  }

  return formattedDates;
}

const { spawn } = require('child_process');

		function runScript(scriptPath, args) {
		  return new Promise((resolve, reject) => {
		    const childProcess = spawn('node', [scriptPath, ...args]);

		    let stdoutData = '';

		    childProcess.stdout.on('data', (data) => {
		      stdoutData += data;
		      console.log(`stdout: ${data}`);
		    });

		    childProcess.stderr.on('data', (data) => {
		      console.error(`stderr: ${data}`);
		    });

		    childProcess.on('exit', (code) => {
		      if (code === 0) {
		        resolve(stdoutData.trim()); // resolve with stdout data
		      } else {
		        reject(`Child process exited with code ${code}`);
		      }
		    });

		    childProcess.on('error', (err) => {
		      reject(`Error spawning child process: ${err}`);
		    });
		  });
		}

		// Run scripts asynchronously
		async function runScripts() {
		  try {
		    // Run prepare_for_influx.js
		    console.log('Running prepare_for_influx.js...');
		    const prepareForInfluxOutput = await runScript('/home/tom/n3rgy/n3rgy_node/functions/prepare_for_influx.js', []);
		    console.log('prepare_for_influx.js completed successfully:', prepareForInfluxOutput);

		    // Run process_prepared_files.js
		    console.log('Running process_prepared_files.js...');
		    await runScript('/home/tom/n3rgy/n3rgy_node/functions/auto_process_prepared_files.js', []);
		    console.log('process_prepared_files.js completed successfully.');
		  } catch (error) {
		    console.error(`Error: ${error}`);
		  }
		}

async function autorun() {
	try {
		console.log( "Calling data collection script first");
		// Get the last 4 days
		const last4Days = getLastNDaysFormattedDates(4);
		const args_array = [
			{arg1: last4Days[0], arg2: last4Days[1], arg3: "data_to_import_01"},
			{arg1: last4Days[1], arg2: last4Days[2], arg3: "data_to_import_02"},
			{arg1: last4Days[2], arg2: last4Days[3], arg3: "data_to_import_03"}
		];

		//Using extra promises to make sure these have all run
		const results = await Promise.all(args_array.map(async({ arg1, arg2, arg3}) => {
			return await fetcher(arg1, arg2, arg3);
		}));

		console.log("All fetcher functions have completed", results);



		Promise.all(results).then( () => {
			// Start running the scripts
			console.log("Introducing delay to ensure all files are ready")
			delay(10000).then(() => {
				runScripts();
			});
			
		});
		


		
	} catch {
		console.error('Error:', error.message);
	}

}

function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

autorun();