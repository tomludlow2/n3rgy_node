//Gas to costs
//This function generates a cost for a given data set.

//Pass a tariff, the consumption value from N3rgy, gas_conversion (m3 to kWh)
function gas_cost(tariff, value, gas_conversion) {
	
	//Get the Total kWh use for the period
	const total_kwh = value * gas_conversion;

	//Generate the usage cost
	const total_kwh_cost = (total_kwh*tariff.gas.unit_price/100);

	//Work out the total cost
	const total_cost = total_kwh_cost;
	return [total_kwh, total_cost];

}
module.exports = gas_cost;