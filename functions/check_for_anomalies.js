const fs = require('fs');
const path = require('path');

// Define the directory where the files are located
const directory = '../reports';

// Function to process each file
const processFile = (filename) => {
    const filepath = path.join(directory, filename);
    const fileContent = fs.readFileSync(filepath, 'utf8');
    const data = JSON.parse(fileContent);
    
    console.log(`Timestamps in ${filename}:`);
    data.forEach(point => {
        if (point.value > 1.0) {
            console.log(point.timestamp, " - value: ",  point.value);
        }
    });
};

// Read files in the directory
fs.readdir(directory, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    // Filter files matching the specified format
    const filteredFiles = files.filter(filename =>
        filename.startsWith('data_to_import_') && filename.endsWith('.json')
    );

    // Process each filtered file
    filteredFiles.forEach(processFile);
});
