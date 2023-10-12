//Electric to costs
//This function generates a cost for a given data set.

//Pass a tariff, the data as an array of [{timestamp: "xx", value:yy}], write_out (true/false)
function electric_cost(tariff, data, write_out) {


	//Setup variables
	let total_cumulative = 0;

	//Handle the dates
	const start_date = data[0].timestamp;
	const end_date = data[data.length-1].timestamp;
	const days_between = get_days_between(end_date, start_date);

	//Go through the data an add up the values
	for(const item of data) {
		if(item && item.value && !isNaN(item.value)) {
			total_cumulative += item.value;
		}
	}
	
	//Get the Total kWh use for the period
	const total_kwh = total_cumulative.toFixed(4);

	//Generate the usage cost
	const total_kwh_cost = (total_cumulative*tariff.electricity.unit_price/100);

	//Work out the standing charge
	const total_sc = (tariff.electricity.standing_charge*days_between/100);

	//Work out the total cost
	const total_cost = total_kwh_cost + total_sc;
		
	//Produce the return information
	const rtn  = {
		"total_kwh": total_kwh,
		"total_kwh_cost" : total_kwh_cost.toFixed(2),
		"total_sc": total_sc.toFixed(2),
		"total_cost": total_cost.toFixed(2),
		"days_between": days_between
	}

	if( write_out ) {
		let output = "\nINFO: Electricity - Data collected from n3rgy api";
		output += "\nDate from: \t\t\t" + start_date;
		output += "\nDate to:  \t\t\t" + end_date;
		output += "\nDays included:\t\t" + days_between;
		output += "\nElectricity Consumption:\t" + total_kwh + "\tkWh";
		output += "\nElectric Cost:\t\t\t£" + total_kwh_cost.toFixed(2);
		output += "\nElectric S/C:\t\t\t£" + total_sc.toFixed(2);
		output += "\nTotal Therefore:\t\t\t£"+ total_cost.toFixed(2);
		//Output the total:
		console.log(output);
		rtn.human_report = output;
	}

	

	return rtn;

}

function get_days_between(x, y) {
	const date1 = new Date(x);
	const date2 = new Date(y);

	const time_diff = Math.abs(date1-date2);

	//Conv to days
	const days_diff = Math.ceil(time_diff / (1000*60*60*24));

	return days_diff;
}

module.exports = electric_cost;