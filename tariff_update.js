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
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const formatDate = (date) => {
  const year = date.getFullYear(); // Get the last two digits of the year
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}${month}${day}`;
};

const start_date = formatDate(today);
const end_date = formatDate(tomorrow);

console.log(start_date, end_date);


const output = 'json';
const queryString = `start=${start_date}&end=${end_date}&output=${output}`;


let tariff = {
	"electricity": {
		"standing_charge" : 0,
		"unit_price": 0
	},
	"gas": {
		"standing_charge": 0,
		"unit_price": 0
	}
}

const options_electricity = {
	hostname: "consumer-api.data.n3rgy.com",
	path: `/electricity/tariff/1?${queryString}`,
	method: "GET",
	headers: {
		'Authorization' : access_token
	}
};

const options_gas = {
	hostname: "consumer-api.data.n3rgy.com",
	path: `/gas/tariff/1?${queryString}`,
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

			// Extract single values for standing charges and unit prices
			const standingChargesArray = jsonData.values.map((item) =>
			  item.standingCharges.map((charge) => charge.value)
			);

			const unitPricesArray = jsonData.values.map((item) =>
			  item.prices.map((price) => price.value)
			);

			// Check if all values in standing charges and unit prices arrays are the same
			const allStandingChargesSame = standingChargesArray.every(
			  (charges) => JSON.stringify(charges) === JSON.stringify(standingChargesArray[0])
			);

			const allUnitPricesSame = unitPricesArray.every(
			  (prices) => JSON.stringify(prices) === JSON.stringify(unitPricesArray[0])
			);

			if (!allStandingChargesSame) {
			  throw new Error("Electricity: Standing charges are not the same across all entries.");
			}

			if (!allUnitPricesSame) {
			  throw new Error("Electricity: Unit prices are not the same across all entries.");
			}

			const standingCharges = standingChargesArray[0][0];
			const unitPrices = unitPricesArray[0][0];

			console.log("Electricity Standing Charge:", standingCharges);
			console.log("Electricity Unit Price:", unitPrices);
			console.log("All Standing Charges are the same.");
			console.log("All Unit Prices are the same.");

			try {
				tariff = JSON.parse(fs.readFileSync('tariff.json', 'utf-8'));
				tariff.electricity.standing_charge = standingCharges;
				tariff.electricity.unit_price = unitPrices;
				const updatedJsonData = JSON.stringify(tariff, null, 2);
				fs.writeFile("tariff.json", updatedJsonData, 'utf-8', (err) => {
					if( err) {
						console.log('Error writing tariff for electricity:', err);
					}else {
						console.log("Success: Electric Tariffs Written");
					}
				});

			}catch(error) {
				console.error('Error reading tariff.json: ', error.message);
				process.exit(1);
			}

			
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

			// Extract single values for standing charges and unit prices
			const standingChargesArray = jsonData.values.map((item) =>
			  item.standingCharges.map((charge) => charge.value)
			);

			const unitPricesArray = jsonData.values.map((item) =>
			  item.prices.map((price) => price.value)
			);

			// Check if all values in standing charges and unit prices arrays are the same
			const allStandingChargesSame = standingChargesArray.every(
			  (charges) => JSON.stringify(charges) === JSON.stringify(standingChargesArray[0])
			);

			const allUnitPricesSame = unitPricesArray.every(
			  (prices) => JSON.stringify(prices) === JSON.stringify(unitPricesArray[0])
			);

			if (!allStandingChargesSame) {
			  throw new Error("Gas: Standing charges are not the same across all entries.");
			}

			if (!allUnitPricesSame) {
			  throw new Error("Gas: Unit prices are not the same across all entries.");
			}

			const standingCharges = standingChargesArray[0][0];
			const unitPrices = unitPricesArray[0][0];

			console.log("Gas Standing Charge:", standingCharges);
			console.log("Gas Unit Price:", unitPrices);
			console.log("All Standing Charges are the same.");
			console.log("All Unit Prices are the same.");

			try {
				tariff = JSON.parse(fs.readFileSync('tariff.json', 'utf-8'));
				tariff.gas.standing_charge = standingCharges;
				tariff.gas.unit_price = unitPrices;
				const updatedJsonData = JSON.stringify(tariff, null, 2);
				fs.writeFile("tariff.json", updatedJsonData, 'utf-8', (err) => {
					if( err) {
						console.log('Error writing tariff for gas:', err);
					}else {
						console.log("Success: Gas Tariffs Written");
					}
				});

			}catch(error) {
				console.error('Error reading tariff.json: ', error.message);
				process.exit(1);
			}
			

			
		}catch (error) {
			console.error(`Error parsing or writing data: ${error.message}`);
		}
	});
});

req_g.on('error', (error) => {
	console.error(`Error with gas request: ${error.message}`);
});

req_g.end();

