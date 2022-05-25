# Dreamsheets Scripts

This package includes scripts and configuration used by `create-dreamsheet`. The [create-dreamsheet](https://github.com/product-os/create-dreamsheet) tool is used to scaffold a _dreamsheet_ project/codebase using version controlled typescript. A "dreamsheet" is a google sheets project that has [google-app-script](https://developers.google.com/apps-script/guides/sheets) (typescript) code it relies upon to give the google spreadsheet "super-powers".

## Usage

### `dsx init <location>`
Hydrates location with a new, ready to develop dreamsheets project. It will copy template files to location, initialize location as git repo, install dependencies. 


### `dsx test`
Will run unit ~and integration~ testing. 
> Integration tests will be implimented in a larger future release


### `dsx build`
Will bundle the source into a single javascript file (as is necessary for google app script)

### `dsx push <script-id>`
Will deploy the bundled script to the specified live google app script. 
You can alternatively specify the `script-id` via an environment variable (or a .env file). For example:
```DSX=myscriptid123 dsx push```

> Before you run this push sub-command, please ensure that you are logged in via [clasp](https://github.com/google/clasp) by running (this only needs to be done once across all projects)
> ```npx @google/clasp login```
> Once logged in, your tokens will be saved in `~/.clasprc.json` in your home directory.
