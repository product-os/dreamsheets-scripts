# Dreamsheets Scripts

Contains dreamsheet scripts used for scaffolded dreamsheets (or google app script spreadsheet) projects

## usage

### `dreamsheets-scripts init <location>`
Gets hydrates location and get's it ready for developing the dreamsheet. It will copy template files to location, initialize location as git repo, install dependencies. 


### `dreamsheets-scripts test`
Will run unit and integration testing


### `dreamsheets-scripts build`
Will bundle the source into a single javascript file (as is necessary for google app script)

### `dreamsheets-scripts push <spreadsheet-id>`
Will deploy the bundled script to the specified live google app script 
