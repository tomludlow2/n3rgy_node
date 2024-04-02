//This function prepares a given data set for insertion into the InfluxDB Node API that I have made

const electricity_to_cost = require("/home/tom/n3rgy/n3rgy_node/functions/electricity_to_cost_basic.js");
const gas_to_cost = require("/home/tom/n3rgy/n3rgy_node/functions/gas_to_cost_basic.js");
const fs = require('fs');
const path = require("path");
const directoryPath = '/home/tom/n3rgy/n3rgy_node/reports';

//Read your access token from config.json
let config;
try {
	config = JSON.parse(fs.readFileSync('/home/tom/n3rgy/n3rgy_node/config.json', 'utf-8'));
}catch(error) {
	console.error('Error reading config.json: ', error.message);
	process.exit(1);
}
const gas_conversion = config.gas_conversion;

//Read your tariff from tariff.json
let tariff;
try {
	tariff = JSON.parse(fs.readFileSync('/home/tom/n3rgy/n3rgy_node/tariff.json', 'utf-8'));
}catch(error) {
	console.error('Error reading tariff.json: ', error.message);
	process.exit(1);
}


//Requires two files, an electric and gas to insert
/*
const electric_file = "/home/tom/n3rgy/n3rgy_node/reports/data_to_import_0_electric.json";;
const gas_file = "/home/tom/n3rgy/n3rgy_node/reports/data_to_import_0_gas.json";
*/

//Or, search a directory for matching files in format "data_to_import_x_electric/gas.json"
function getMatchingFiles(directoryPath) {
    const files = fs.readdirSync(directoryPath);
    const electricFiles = [];
    const gasFiles = [];

    // Regular expression to match files with the pattern data_to_import_x_electric.json or data_to_import_x_gas.json
    const pattern = /^data_to_import_(\d+)_(electric|gas)\.json$/;

    files.forEach((file) => {
    	console.log("Checking each file, next file: ", file);
        const filePath = path.join(directoryPath, file);

        if (fs.statSync(filePath).isFile()) {
            const match = file.match(pattern);

            if (match) {
                const x = parseInt(match[1], 10);
                const fileType = match[2];

                if (!isNaN(x) && x >= 0) {
                    if (fileType === 'electric') {
                        electricFiles.push({
                            filename: file,
                            filePath: filePath,
                            x,
                        });
                    } else if (fileType === 'gas') {
                        gasFiles.push({
                            filename: file,
                            filePath: filePath,
                            x,
                        });
                    }
                }
            }
        }
    });

    // Sort the electric and gas files based on x value
    electricFiles.sort((a, b) => a.x - b.x);
    gasFiles.sort((a, b) => a.x - b.x);

    return { electricFiles, gasFiles };
}

//Actually run and initiate the function
const { electricFiles, gasFiles } = getMatchingFiles(directoryPath);

console.log('Electric Files:');
console.log(electricFiles);

console.log('Gas Files:');
console.log(gasFiles);

if(electricFiles.length == gasFiles.length) {
	for (var i = 0; i < gasFiles.length; i++) {
		console.log("Now working on file:", i, gasFiles[i], electricFiles[i]);
		convertData(gasFiles[i].filePath, electricFiles[i].filePath, "pending_insert_" + i);
	}
}


function convertData(gas_file, electric_file, output_file_name) {
	const gas_data = JSON.parse(fs.readFileSync(gas_file, "utf-8"));
	const electric_data = JSON.parse(fs.readFileSync(electric_file, "utf-8"));

	const gas_output = [];
	const electric_output = [];

	gas_data.forEach((data_point) => {
		//console.log("Sorting data point", data_point);
		let processesd_data = gas_to_cost(tariff, data_point.value, gas_conversion);
		let new_data_point = {
			timestamp: data_point.timestamp,
			usage: processesd_data[0],
			cost: processesd_data[1]*100
		}
		gas_output.push(new_data_point);
	});

	electric_data.forEach((data_point) => {
		//console.log("Sorting data point", data_point);
		let processesd_data = electricity_to_cost(tariff, data_point.value);
		let new_data_point = {
			timestamp: data_point.timestamp,
			usage: processesd_data[0],
			cost: processesd_data[1]*100
		}
		electric_output.push(new_data_point);
	});

	const output = {
		"electricity": electric_output,
		"gas": gas_output
	};

	//console.log(output);

	const output_file = "/home/tom/n3rgy/n3rgy_node/pending_influx/" + output_file_name+ ".json";
	fs.writeFile(output_file, JSON.stringify(output, null, 2), "utf-8", (err) => {
	 	if (err) {
			console.error(`Error writing to ${output_file}: ${err}`);
		} else {
		console.log(`Data has been written to ${output_file}`);
		}
	});
}

//convertData();