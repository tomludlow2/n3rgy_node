const fetcher = require("/home/tom/n3rgy_node/functions/get_for_date_range.js");


const spread = 
[
  [ '20240107', '20240109', 'data_to_import_01' ]/*,
  [ '20230305', '20230310', 'data_to_import_02' ],
  [ '20230310', '20230315', 'data_to_import_03' ],
  [ '20230315', '20230320', 'data_to_import_04' ],
  [ '20230320', '20230325', 'data_to_import_05' ],
  [ '20230325', '20230331', 'data_to_import_06' ]*/
]


spread.forEach((series) => {
	let op = fetcher(series[0], series[1], series[2]);
});

