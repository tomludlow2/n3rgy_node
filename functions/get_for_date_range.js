/*

This function gets the electricity and gas readings for a given date range. 
Exported as a  module

*/

const https = require('https');
const fs = require('fs');
const electricity_to_cost = require("/home/tom/n3rgy_node/functions/electricity_to_cost.js");
const gas_to_cost = require("/home/tom/n3rgy_node/functions/gas_to_cost.js");

//Read your access token from config.json
let config;
try {
	config = JSON.parse(fs.readFileSync('/home/tom/n3rgy_node/config.json', 'utf-8'));
}catch(error) {
	console.error('Error reading config.json: ', error.message);
	process.exit(1);
}

//Read your tariff from tariff.json
let tariff;
try {
	tariff = JSON.parse(fs.readFileSync('/home/tom/n3rgy_node/tariff.json', 'utf-8'));
}catch(error) {
	console.error('Error reading tariff.json: ', error.message);
	process.exit(1);
}


//Get the last 7 days.
async function get_for_date_range(start_date, end_date, log_file) {
	console.log("INFO: Getting info for date range", start_date, end_date, log_file);
	//Expects YYYY-MM-DD HH:MM
	/*OLD FUNCTION
	const today = new Date(); // Get the current date and time
	today.setHours(0, 0, 0, 0); // Set the time to midnight

	const dates = [];
	const human_dates = [];

	for (let i = 0; i <= 7; i++) {
		const date = new Date(today);
		date.setDate(today.getDate() - i);

		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
		const day = date.getDate().toString().padStart(2, '0');

		const formattedDate = `${year}${month}${day}`;
		const humanFormat = `${day} - ${month} - ${year}`;
		dates.push(formattedDate);
		human_dates.push(humanFormat);
	}

	// Return an array with today's date and the date from a week ago
	return [dates[0], dates[7], human_dates[0], human_dates[7]];*/

	//Get the constants required.
	const access_token = config.auth_token;
	const gas_conversion = config.gas_conversion;
	const start = start_date;
	const end = end_date;
	const output = 'json';
	const queryString = `start=${start}&end=${end}&output=${output}`;

	let electric_total = 0;
	let gas_total = 0;

	const options_electricity = {
		hostname: "consumer-api.data.n3rgy.com",
		path: `/electricity/consumption/1?${queryString}`,
		method: "GET",
		headers: {
			'Authorization' : access_token
		}
	};

	const options_gas = {
		hostname: "consumer-api.data.n3rgy.com",
		path: `/gas/consumption/1?${queryString}`,
		method: "GET",
		headers: {
			'Authorization' : access_token
		}
	}


	//Setup the promises to return

	return new Promise((resolve, reject) => {
		//Use an array to store the promises for the requests
		const request_promises = [];


		//First request:
		const req_e = https.request(options_electricity, (res) => {
			let data = '';
			res.on('data', (chunk) => {
				data += chunk;
			});

			res.on('end', () => {
				try {
					//Data has now loaded, manipulate as required
					const jsonData = JSON.parse(data);

					//Extract the values array
					const valuesArray = jsonData.values;

					//Process and structure the data
					const processedData = valuesArray.map((item) => ({
						timestamp: item.timestamp,
						value: item.value
					}));

					//Call the electricity process
					//let output = electricity_to_cost(tariff, processedData, true);

					let output = processedData;

					//Write out the report to the json file
					const json_str = JSON.stringify(output, null, 2);
					console.log("Storing information in the ", log_file, " for electric");
					if( log_file ) {
						const electric_report_file = `/home/tom/n3rgy_node/reports/${log_file}_electric.json`;
						fs.writeFileSync(electric_report_file, json_str, 'utf8', (err) => {
							if(err) {
								console.error("Could not write electric file:", err);
							}else {
								console.log("Report written for electric to " + electric_report_file);
							}
						});
					}

					resolve(output);
				}catch (error) {
					if( log_file ) {
						const electric_report_file = `/home/tom/n3rgy_node/reports/${log_file}_electric.json`;
						fs.writeFileSync(electric_report_file, error, 'utf8', (err) => {
							if(err) {
								console.error("Could not write electric file:", err);
							}else {
								console.log("Report written for electric to " + electric_report_file);
							}
						});
					}
					console.error(`Error parsing or writing data: ${error.message}`);
					reject(error);
				}
			});
		});

		req_e.on('error', (err) => {
			if( log_file ) {
				const electric_report_file = `/home/tom/n3rgy_node/reports/${log_file}_electric.json`;
				fs.writeFileSync(electric_report_file, error, 'utf8', (err) => {
					if(err) {
						console.error("Could not write electric file:", err);
					}else {
						console.log("Report written for electric to " + electric_report_file);
					}
				});
			}
			reject(error);
		})


		request_promises.push(new Promise((resolve, reject) =>  {
			req_e.end();
		}));


		//Second request:
		const req_g = https.request(options_gas, (res) => {
			let data = '';
			res.on('data', (chunk) => {
				data += chunk;
			});

			res.on('end', () => {
				try {

					//Data has now loaded, manipulate as required
					const jsonData = JSON.parse(data);

					//Extract the values array
					const valuesArray = jsonData.values;



					//Process and structure the data
					const processedData = valuesArray.map((item) => ({
						timestamp: item.timestamp,
						value: item.value
					}));

					//Call the gas function
					//let output = gas_to_cost(tariff, processedData, gas_conversion, true);

					//Or - supply raw data
					let output = processedData;

					//Write out the report to the json file
					const json_str = JSON.stringify(output, null, 2);
					console.log("Storing information in the ", log_file, " for gas");
					const gas_report_file = `/home/tom/n3rgy_node/reports/${log_file}_gas.json`;
					fs.writeFileSync(gas_report_file, json_str, 'utf8', (err) => {
						if(err) {
							console.error("Could not write gas file:", err);
						}else {
							console.log("Report written for gas to " + gas_report_file);
						}
					});
					resolve(output);
				}catch (error) {
					if( log_file ) {
						const gas_report_file = `/home/tom/n3rgy_node/reports/${log_file}_gas.json`;
						fs.writeFileSync(gas_report_file, error, 'utf8', (err) => {
							if(err) {
								console.error("Could not write gas file:", err);
							}else {
								console.log("Report written for gas to " + gas_report_file);
							}
						});
					}
					console.error(`Error parsing or writing data: ${error.message}`);
					reject(error);
				}
			});
		});

		req_g.on('error', (err) => {
			if( log_file ) {
				const gas_report_file = `/home/tom/n3rgy_node/reports/${log_file}_gas.json`;
				fs.writeFileSync(gas_report_file, error, 'utf8', (err) => {
					if(err) {
						console.error("Could not write gas file:", err);
					}else {
						console.log("Report written for gas to " + gas_report_file);
					}
				});
			}
			reject(error);
		});

		request_promises.push( new Promise((resolve, reject) => {
			req_g.end();
		}));

		Promise.all(request_promises).then(([request_e, request_g]) => {
			const result = [request_e, request_g];
			resolve(result);
		}).catch((error) => {
			reject(error);
		});


	});



}

module.exports = get_for_date_range;