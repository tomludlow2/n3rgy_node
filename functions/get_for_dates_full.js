const fetcher = require("/home/tom/n3rgy/n3rgy_node/functions/get_for_date_range.js");


const spread = 
[
  [ '20240228', '20240303', 'data_to_import_01' ]/*,
  [ '20240203', '20240207', 'data_to_import_02' ],
  [ '20240207', '20240210', 'data_to_import_03' ],
  [ '20240210', '20240214', 'data_to_import_04' ],
  [ '20240214', '20240218', 'data_to_import_05' ],
  [ '20240218', '20240222', 'data_to_import_06' ],
  [ '20240222', '20240226', 'data_to_import_07' ],
  [ '20240226', '20240301', 'data_to_import_08' ]*/
]


spread.forEach((series) => {
	let op = fetcher(series[0], series[1], series[2]);
});

