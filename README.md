# Dreamsheets Scripts

This package includes scripts and configuration used to scaffold and develop a _dreamsheet_ project/codebase using version controlled typescript. A "dreamsheet" is a google sheets project that has [google-app-script](https://developers.google.com/apps-script/guides/sheets) (typescript) code it relies upon to give the google spreadsheet "super-powers".

## Usage

### `dsx init <new-project-name-or-path>`
Hydrates the specified directory (`new-project-name-or-path`) with a new, ready to develop dreamsheets project. It will copy template files to that directory, initialize it as git repo, and install dependencies. 


### `dsx test`
Runs unit ~and integration~ testing. 
> Integration tests will be implimented in a larger future release.


### `dsx build`
Bundles the source into a single javascript file (as is necessary for google app script) it readiness for deployment. This bundle is located at `dist/index.bundle.js`.

### `dsx push <script-id>`
Deploys the bundled script to the specified live (google sheet's) google app script. 
You can alternatively specify the `script-id` via an environment variable (or a .env file) like:

```
DSX_SCRIPT_ID=myScriptId_123 dsx push
```

> Before you run this `push` sub-command, please ensure that you are logged in via [clasp](https://github.com/google/clasp) by running (this only needs to be done once across all projects)
> ```npx @google/clasp login```
> Once logged in, your access tokens will be saved in `~/.clasprc.json` in your home directory.
