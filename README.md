# Dreamsheets Scripts

This package includes scripts and configuration used by `create-dreamsheet`. The [create-dreamsheet](https://github.com/product-os/create-dreamsheet) tool is used to scaffold a _dreamsheet_ project/codebase using version controlled typescript. A "dreamsheet" is a google sheets project that has [google-app-script](https://developers.google.com/apps-script/guides/sheets) (typescript) code it relies upon to give the google spreadsheet "super-powers".

## Usage

### `dreamsheets-scripts init <location>`
Hydrates location with a new, ready to develop dreamsheets project. It will copy template files to location, initialize location as git repo, install dependencies. 


### `dreamsheets-scripts test`
Will run unit and integration testing


### `dreamsheets-scripts build`
Will bundle the source into a single javascript file (as is necessary for google app script)

### `dreamsheets-scripts push <script-id>`
Will deploy the bundled script to the specified live google app script 
