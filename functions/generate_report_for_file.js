const electricity_to_cost = require("./electricity_to_cost.js");
const gas_to_cost = require("./gas_to_cost.js");
const fs = require('fs');

const electric_files_to_run = [
	"example_file_1_electric.json",
	"example_file_2_electric.json"];

const gas_files_to_run = [
	"example_file_1_gas.json",
	"example_file_2_gas.json"];

//Read your access token from config.json
let config;
try {
	config = JSON.parse(fs.readFileSync('../config.json', 'utf-8'));
}catch(error) {
	console.error('Error reading config.json: ', error.message);
	process.exit(1);
}
const gas_conversion = config.gas_conversion;

//Read your tariff from tariff.json
let tariff;
try {
	tariff = JSON.parse(fs.readFileSync('../tariff.json', 'utf-8'));
}catch(error) {
	console.error('Error reading tariff.json: ', error.message);
	process.exit(1);
}

let outputs = {
	"report_title": "Generated Electric Report",
	"ran_from": "generate_report_for_file.js"
};


function run_for_file_electricity(file) {
	return new Promise( (resolve, reject) => {
		fs.readFile(file, 'utf-8', (err, data) => {
			if(err) {
				console.error(`Error reading file: ${err}`);
				resolve(err);
				return;
			}
			try {
				const loadedData = JSON.parse(data);
				let output = electricity_to_cost(tariff, loadedData, false);
				//console.log(output);
				outputs["file_" + file.split("/home/tom/n3rgy_node/reports/")[1]] = output;
				resolve(output);
			} catch (error) {
				console.error("Error parsing data:", error);
				resolve(error);
			}
		});
	});
}

function run_for_file_gas(file) {
	return new Promise( (resolve, reject) => {
		fs.readFile(file, 'utf-8', (err, data) => {
			if(err) {
				console.error(`Error reading file: ${err}`);
				resolve(err);
				return;
			}
			try {
				const loadedData = JSON.parse(data);
				let output = gas_to_cost(tariff, loadedData, gas_conversion, false);
				//console.log(output);
				outputs["file_" + file.split("/home/tom/n3rgy_node/reports/")[1]] = output;
				resolve(output);
			} catch (error) {
				console.error("Error parsing data:", error);
				resolve(error);
			}
		});
	});
}

const electric_promises = [];
electric_files_to_run.forEach((file) => {
	electric_promises.push(run_for_file_electricity(file));
});

Promise.all(electric_promises).then((result) => {
	console.log("Electric Data Processing has completed. Saving data");
	const output_file = "../reports/generated_report_electric.json";
	fs.writeFile(output_file, JSON.stringify(outputs, null, 2), "utf-8", (err) => {
	 	if (err) {
			console.error(`Error writing to ${output_file}: ${err}`);
		} else {
		console.log(`Data has been written to ${output_file}`);
		}
	});
});

const gas_promises = [];
gas_files_to_run.forEach((file) => {
	gas_promises.push(run_for_file_gas(file));
});

Promise.all(gas_promises).then((result) => {
	console.log("Gas Data Processing has completed. Saving data");
	const output_file = "../reports/generated_report_gas.json";
	fs.writeFile(output_file, JSON.stringify(outputs, null, 2), "utf-8", (err) => {
	 	if (err) {
			console.error(`Error writing to ${output_file}: ${err}`);
		} else {
		console.log(`Data has been written to ${output_file}`);
		}
	});
});


/*
Promise.all(file_promises).then(() => {
	const output_file = "../reports/generated_report_electric.json";
	fs.writeFile(output_file, JSON.stringify(outputs, null, 2), "utf-8", (err) => {
	 	if (err) {
			console.error(`Error writing to ${output_file}: ${err}`);
		} else {
		console.log(`Data has been written to ${output_file}`);
		}
	});

	console.log("OUTPUTS: ");
	console.log(outputs);
});




*/