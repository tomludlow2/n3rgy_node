const fetcher = require("/home/tom/n3rgy/n3rgy_node/functions/get_for_date_range.js");


const spread = 
[
  /*[ '20240129', '20240203', 'data_to_import_01' ],
  [ '20240303', '20240307', 'data_to_import_02' ],
  [ '20240307', '20240310', 'data_to_import_03' ],
  [ '20240310', '20240314', 'data_to_import_04' ]*/,
  [ '20240314', '20240318', 'data_to_import_05' ],
  [ '20240318', '20240322', 'data_to_import_06' ],
  [ '20240322', '20240326', 'data_to_import_07' ],
  [ '20240326', '20240330', 'data_to_import_08' ]
]


spread.forEach((series) => {
	let op = fetcher(series[0], series[1], series[2]);
});

