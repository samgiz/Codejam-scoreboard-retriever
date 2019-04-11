# Codejam-scoreboard-retriever
Some simple code to retrieve a Codejam round scoreboard and filter the entries by country

## Setup
You will need to have node.js and npm installed (more information [here](https://nodejs.org/en/))
I'm using node version 11.13.0 and npm version 6.7.0. Anything above 8.0.0 should work for node, many lower npm versions should also work fine.
Once npm is set up, install dependencies with the following command:

```
npm install
```

## Usage
You will need to set the the contest id and country in the script (the variables are located at the top of the script)
By default the contest id is set to the most recent contest, and the country that is being filtered is Lithuania
Further instructions can be found in the script itself.

Once you have set the country and contest id, run the script as follows to print the filtered results in the terminal:

```
node get_codejam_results.js
```

If instead you would like to save the results into a file, you can redirect the output as follows:

```
node get_codejam_results.js > path/to/output/file
```

If you want to use the scoreboard data for some other reason, you can access it in the Promise.all block in the `print_all_from_country` function.
The data will be available as downloaded , so in blocks of `iteration_increment` (200 by default), except for possibly the last element if the scoreboard size is not a multiple of `iteration_increment`.