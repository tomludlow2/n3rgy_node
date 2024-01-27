# Project Documentation

## Introduction

This project consists of Node.js scripts that interact with the n3rgy domain to collect JSON data related to electricity and gas usage. These scripts are designed to fetch data, process it, and store it locally for further analysis or use. This documentation provides instructions on how to set up and use these scripts.

## n3rgy Setup
1. **Collect Info you will need**

   You will need the following:
   - `MPxN` Number - either an MPAN or MPRN from a smart meter (these should be on either the gas or electric meter)
   - Write down both in case one doesn't work although technically either should work
   - `IHD MAC Address` - Found on a home smart meter panel (the device from your energy provider that shows your usage, typically small LCD displays mounted in the kitchen / hallway).

2. **Signup online**

   - Navigate to n3rgy consumer login [here](https://data.n3rgy.com/consumer-login)
   - Input your `MPxN` into the box, this will be found on your meter (either the MPAN or MPRN), you only need one from either the gas or electricity meter. 
   - Click Login.
   - On the next screen, click on IHD MAC Authentication 
   - Type the `IHD MAC Address` into this box without spaces / hyphens, all in caps. 
   - Copy this value before clicking login (this will be your `auth_token` later on)
   - Click Login

3. **Authorise n3rgy**
Follow instructions to authorise n3rgy to read your consumption and tariff

You should reach a screen with an option to "Access My Data", currently found [here](https://data.n3rgy.com/consumer/download-data)

As a test to check that n3rgy can get your data (and hence this API), run a test chosing a start date (must be after you signed up) and end date, ticking electricity -> consumption first as a test, then the same for gas -> consumption. Click Download.

If this downloads with appropriate data, you are ready to configure the api.


## How to Install

Follow these steps to set up the project:

1. **n3rgy setup**

   - Ensure the above has been setup


2. **Clone the Repository**:

   Clone the project repository to your local machine:

   ```bash
   git clone https://github.com/tomludlow2/n3rgy_node.git
   ```


3. **Navigate to the Project Directory**:

Change your working directory to the project folder:


   ```bash
   cd your-repo
   ```

4. **Install Dependencies**:

Install any necessary dependencies:
You will require an up to date node runtime and packages: https and fs
You can install these with npm
   
   ```bash
   npm install https
   ```

5. **Configuration**:

- Rename `config_template.json` to `config.json`  in the project directory.
   ```bash
     cp config_template.json config.json
     ```

- Add your n3rgy access token to the `config.json` file:

  ```json
  {
    "auth_token": "yourAccessToken"
  }
  ```

Replace `"yourAccessToken"` with your actual access token.

Replace `"start_date"` with the start date for your energy request format `yyyymmdd`
Replace `"end_date"` with the end date for your request (specify today and you will get the most up to date info they have although there is a delay with n3rgy data (typically 12 hours or so))
Replace `"gas_consumption"` with the factor that converts your reading to kWh. To find this, look on your energy bill for a section under Gas Charges. Typically: `Gas UNITS x Calorific Value x Volume Correction / Modifier`  e.g. `Units x Calorific Value(40.1) * Volume Correction (1.02264) / 3.6 = 11.3910733` for my supply. 
Set this value to 1 if your n3rgy account is supplying energy in kWh already. 
Replace `"bearer_token"` with the bearer token for your instance of my InfluxDBAPI if using this

## Collecting Consumption Data

To run the project and collect JSON data, follow these steps:

1. **Execute the Script**:

Run the Node.js script to fetch and process data:

   ```bash
   node energy_to_json.js
   ```

2. **Data Storage**:

The script will collect and process data from the n3rgy domain and store it in two local JSON files named `electricity.json` and `gas.json`.

3. **Access Data**:

You can access the collected data in the json files for further analysis or use in your application.

That's it! You now have the project set up, and you can run the script to collect JSON data related to electricity and gas usage from the n3rgy domain.

Feel free to customize and expand upon this documentation template as needed for your project.


## Collecting Tariff Data

To run the project and collect JSON data, follow these steps:

1. **Setup Tariff File**
- Rename `tariff_template.json` to `tariff.json`  in the project directory.
   ```bash
     cp tariff_template.json tariff.json
     ```

2. **Execute the Script**:

Run the Node.js script to fetch and process data:
This will collect the current tariff information for both gas and electricity and store it
You may experience errors if the tariff during the last 24 hours.

   ```bash
   node tariff_update.js
   ```

3. **Data Storage**:

The script will collect and process data from the n3rgy domain and store it in the local JSON file `tariff.json`.


## Last 7 Days Report

Using `last_7_days.js`

This function will load the last consecutive 7 days of gas and electric usage, and then use two functions found in `functions/`:  `electricity_to_cost.js`  and `gas_to_cost.js`  to output your costs for the last 7 days. 

1. **Simple Function**

Simply call `node last_7_days.js`
The default config of this file will output the information on the command line and will create a report for each of electricity and gas that will be stored in `reports/last_7_days_electricity.json` and `reports/last_7_days_gas.json` respectively. 

2. **Reading the Output**

The output of these reports will be:
```json
   {
     "total_kwh": "58.7860",
     "total_kwh_cost": "10.85",
     "total_sc": "1.58",
     "total_cost": "12.43",
     "days_between": 7,
     "human_report": "\nINFO: Electricity - Data collected from n3rgy api\nD..."
   }
```

Where `total_kwh` is the total kilo-watt hours of energy used, `total_cost` is that value multiplied by the unit charge and converted to pounds, `total_sc` is the standing charge multiplied by the number of days (7 in this case) and `human_report` is the same output as produced by the inline function.

3. **Adapting this function**

The code can easily be reproduced to generate similar reports for any data set you have. The general requirement:

```node
   const electric_to_cost = require("./functions/electricity_to_cost.js");
   const gas_to_cost = require("./functions/gas_to_cost.js");

   //Example format of electric or gas data
   const electric_data = [
      {
       "timestamp": "2023-10-01 00:30",
       "value": 0.068
     },
     {
       "timestamp": "2023-10-01 01:00",
       "value": 0.055
     },
   ] //To n

   const tariff = {
      /*Tariff file loaded in in same format as for tariff_template.json - either manually or programatically complete*/
   }
   const gas_conversion = 11.3910733 //Can store in config.json

   //Electricity_to_cost expects (tariff, data, write_data_out)
   const electricity_report = electricity_to_cost(tariff, electric_data, true);

   //Gas_to_cost expects (tariff, data, gas_conversion, write_data_out)
   const gas_report = gas_to_cost(tariff, gas_data, gas_conversion, true);

   //Each function will return the data you see in the report.json files
```


## Generating Full Month Reports

Uses `get_for_dates_test.js`

Within this function simply change date 1 to `YYYYMMDD` e.g. `20230401` and date 2 to e.g. `20230501` using month to month of same day to get full month (otherwise will return one day short). Change the third parameter to a descriptor e.g. `APR_23` etc. 

This will create a file `reports/APR_23_electric.json` and `reports/APR_23_gas.json`

Then open `functions/generate_report_for_file.js`
In `electric_files_to_run` and `gas_files_to_run` input the names of the reports you wish to run 
Also change `output_file` within the gas and electric functions to wherever you would like the report saving.

Run this file, which will produce a report file for all files in the array. 


## Preparing for influx & inserting into the InfluxDB
Using `functions/prepare_for_influx.js` and `get_for_dates_full.js`
- Run `get_for_dates_full.js` which you should populate to fill the relevant dates (using 5 day intervals helps to prevent excessive data per one file insert). Field 2 needs to contain a filename in the format of `data_to_import_xx` where xx is an incremental value, and will be appended with the gas and then electric values ready for import.
- These files will be stored in `reports/` directory.
- Then run `prepare_for_influx.js` to prepare the files, this will perform the following.
- Opens relevant files, including `config` and `tariff` -> Both must have been set before calling this
- Then looks inside a directory, held in `directoryPath` at the top of the function
- Looks through these for files that match the reg expression for `data_to_import_xx_electric/gas.json`
- These files should already exist and are created through the process above
- The function then arranges the data:
-- Converts the data into the right format for storage using the InfluxDB API I have created
-- The outputs are then stored in `pending_influx/`  directory.
-- These files are stored in the `json` format ready to be inserted using the `/submit_energy` endpoint
- The next step is the call `process_prepared_files.js` which will loop through all the files one by one and submit, it manually asks for the array key of the next file you want to import, (noted in current example as files are no zero-prefixed) this creates an abnormal entry pattern


## Correcting errors in the database
- Open `get_for_dates_full.js` and ammend the first dates parameter to the day before and the day after the error.
- `node get_for_dates_full.js`
- Open `reports/data_to_import_01_gas/electric.json`
- Find the incorrect line and adjust accordingly
- Run `prepare_for_influx.js`
- Run `process_prepared_files.js`


## Misc File Information

- `electricity_to_cost_basic.js` and `gas_to_cost_basic.js` simply convert electricity usage and gas usage to cost
-- Call as `func(tariff, usage)` or `fn(tariff, usage, conversion)` and receive a cost back in pounds
