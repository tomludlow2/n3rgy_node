//Electric to costs
//This function generates a cost for a given data set.

//Pass a tariff, and the usage provided by n3rgy
function electric_cost(tariff, data) {
	//Get the Total kWh use for the period
	const total_kwh = data;

	//Generate the usage cost
	const total_kwh_cost = (total_kwh*tariff.electricity.unit_price/100);


	//Work out the total cost
	const total_cost = total_kwh_cost;	
	return [total_kwh, total_cost];

}


module.exports = electric_cost;