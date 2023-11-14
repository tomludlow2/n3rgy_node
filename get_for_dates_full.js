const fetcher = require("./functions/get_for_date_range.js");


const spread = 
[
  [ '20231031', '20231105', 'data_to_import_01' ],
  [ '20231105', '20231110', 'data_to_import_02' ],
  [ '20231110', '20231114', 'data_to_import_03' ]
]


spread.forEach((series) => {
	let op = fetcher(series[0], series[1], series[2]);
});

