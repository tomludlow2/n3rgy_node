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
   git clone https://github.com/your-username/your-repo.git
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

## Running the Project

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