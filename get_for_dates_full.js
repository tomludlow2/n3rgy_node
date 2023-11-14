const fetcher = require("./functions/get_for_date_range.js");


const spread = 
[
  [ '20230315', '20230320', 'data_to_import_0' ],
  [ '20230320', '20230325', 'data_to_import_1' ],
  [ '20230325', '20230329', 'data_to_import_2' ],
  [ '20230329', '20230403', 'data_to_import_3' ],
  [ '20230403', '20230408', 'data_to_import_4' ],
  [ '20230408', '20230413', 'data_to_import_5' ],
  [ '20230413', '20230418', 'data_to_import_6' ],
  [ '20230418', '20230423', 'data_to_import_7' ],
  [ '20230423', '20230428', 'data_to_import_8' ],
  [ '20230428', '20230503', 'data_to_import_9' ],
  [ '20230503', '20230508', 'data_to_import_10' ],
  [ '20230508', '20230513', 'data_to_import_11' ],
  [ '20230513', '20230518', 'data_to_import_12' ],
  [ '20230518', '20230523', 'data_to_import_13' ],
  [ '20230523', '20230528', 'data_to_import_14' ],
  [ '20230528', '20230602', 'data_to_import_15' ],
  [ '20230602', '20230607', 'data_to_import_16' ],
  [ '20230607', '20230612', 'data_to_import_17' ],
  [ '20230612', '20230617', 'data_to_import_18' ],
  [ '20230617', '20230622', 'data_to_import_19' ],
  [ '20230622', '20230627', 'data_to_import_20' ],
  [ '20230627', '20230702', 'data_to_import_21' ],
  [ '20230702', '20230707', 'data_to_import_22' ],
  [ '20230707', '20230712', 'data_to_import_23' ],
  [ '20230712', '20230717', 'data_to_import_24' ],
  [ '20230717', '20230722', 'data_to_import_25' ],
  [ '20230722', '20230727', 'data_to_import_26' ],
  [ '20230727', '20230801', 'data_to_import_27' ],
  [ '20230801', '20230806', 'data_to_import_28' ],
  [ '20230806', '20230811', 'data_to_import_29' ],
  [ '20230811', '20230816', 'data_to_import_30' ],
  [ '20230816', '20230821', 'data_to_import_31' ],
  [ '20230821', '20230826', 'data_to_import_32' ],
  [ '20230826', '20230831', 'data_to_import_33' ],
  [ '20230831', '20230905', 'data_to_import_34' ],
  [ '20230905', '20230910', 'data_to_import_35' ],
  [ '20230910', '20230915', 'data_to_import_36' ],
  [ '20230915', '20230920', 'data_to_import_37' ],
  [ '20230920', '20230925', 'data_to_import_38' ],
  [ '20230925', '20230930', 'data_to_import_39' ],
  [ '20230930', '20231005', 'data_to_import_40' ],
  [ '20231005', '20231010', 'data_to_import_41' ],
  [ '20231010', '20231015', 'data_to_import_42' ],
  [ '20231015', '20231020', 'data_to_import_43' ],
  [ '20231020', '20231025', 'data_to_import_44' ],
  [ '20231025', '20231031', 'data_to_import_45' ],
  [ '20231031', '20231105', 'data_to_import_46' ]
]


spread.forEach((series) => {
	let op = fetcher(series[0], series[1], series[2]);
});

