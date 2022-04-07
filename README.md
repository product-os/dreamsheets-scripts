# Dreamsheets Scripts

A "Dreamsheet" is a google sheets project that has google app script code it relies upon for extra "super-powers".  
"Dreamsheets Scripts" is a utility for managing various aspects of developing a scaffolded dreamsheet project/codebase using version controlled typescript. 

## usage

### `dreamsheets-scripts init <location>`
Hydrates location with a new, ready to develop dreamsheets project. It will copy template files to location, initialize location as git repo, install dependencies. 


### `dreamsheets-scripts test`
Will run unit and integration testing


### `dreamsheets-scripts build`
Will bundle the source into a single javascript file (as is necessary for google app script)

### `dreamsheets-scripts push <spreadsheet-id>`
Will deploy the bundled script to the specified live google app script 
