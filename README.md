# Dreamsheets Scripts

This package includes scripts and configuration used to scaffold and develop a _dreamsheet_ project/codebase using version controlled typescript. A "dreamsheet" is a google sheets project that has [google-app-script](https://developers.google.com/apps-script/guides/sheets) (typescript) code it relies upon to give the google spreadsheet "super-powers".

## Installation

You can create/scaffold a brand *new* dreamsheets project by running

```bash
npx dreamsheets-scripts@latest init name-of-new-project
```

Alternatively, you can use this tool in an existing project by navigating to the project and adding ```dreamsheets-scripts@lastest``` to your
 *devDependancies* and adding the following to your package.json's `"scripts"` section:

```yaml
    "build": "dsx build",
    "test": "dsx test",
    "push": "dsx push <your gheet's scriptId here>",
```

## Usage

### `dsx init <new-project-name-or-path>`
Hydrates the specified directory (`new-project-name-or-path`) with a new, ready to develop dreamsheets project. It will copy template files to that directory, initialize it as git repo, and install dependencies. 


### `dsx test`
Runs unit ~and integration~ testing. 
> Integration tests will be implimented in a larger future release.


### `dsx build`
Bundles the source into a single javascript file (as is necessary for google app script) it readiness for deployment. This bundle is located at `dist/index.bundle.js`.

### `dsx push <script-id> [--oauth-scopes=scope1,scop2]`
Deploys the bundled script to the specified live (google sheet's) google app script. 
You can alternatively specify the `script-id` via an environment variable (or a .env file) like:

```
DSX_SCRIPT_ID=myScriptId_123 dsx push
```

> Before you run this `push` sub-command, please ensure that you are logged in via [clasp](https://github.com/google/clasp) by running (this only needs to be done once across all projects)
> ```npx @google/clasp login```
> Once logged in, your access tokens will be saved in `~/.clasprc.json` in your home directory.

#### OAuth Scops option
By default, the only oAuth scope used for deployment is 'https://www.googleapis.com/auth/spreadsheets'. If you would like to change that scope or provide extra scopes, you can do so by adding a `--oauth-scopes` flag. This should be a comma separated list of urls, for example:

```
--oauth-scopes=https://www.googleapis.com/auth/spreadsheets.readonly,https://www.googleapis.com/auth/userinfo.email
```
