const https = require('https');
const fs = require('fs');

//Read your access token from config.json
let config;
try {
	config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
}catch(error) {
	console.error('Error reading config.json: ', error.message);
	process.exit(1);
}

const access_token = config.auth_token;
const start = config.start_date;
const end = config.end_date;
const output = 'json';
const queryString = `start=${start}&end=${end}&output=${output}`;


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

			//Write the processed data to a JSON file
			fs.writeFileSync('electricity.json', JSON.stringify(processedData, null, 2));
			console.log('Data written to electricity.json');
		}catch (error) {
			console.error(`Error parsing or writing data: ${error.message}`);
		}
	});
});

req_e.on('error', (error) => {
	console.error(`Error with electricity request: ${error.message}`);
});

req_e.end();

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

			//Write the processed data to a JSON file
			fs.writeFileSync('gas.json', JSON.stringify(processedData, null, 2));
			console.log('Data written to gas.json');
		}catch (error) {
			console.error(`Error parsing or writing data: ${error.message}`);
		}
	});
});

req_g.on('error', (error) => {
	console.error(`Error with gas request: ${error.message}`);
});

req_g.end();