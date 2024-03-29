import { os, fs, path } from 'zx';

import { DEFAULT_OAUTH_SCOPE } from '../constants.mjs';
export async function push(
	scriptId: string,
	oauthScopes = [DEFAULT_OAUTH_SCOPE],
) {
	if (!scriptId) {
		throw new Error('Please provide a script-id');
	}

	// $HOME/.clasprc.json
	const authPath = path.join(os.homedir(), './.clasprc.json');
	if (!(await fs.pathExists(authPath))) {
		throw new Error('Please log in using `npx @google/clasp login`');
	}

	// ./dist/appsscript.json
	const distPath = path.join(process.cwd(), './dist');

	if (!(await fs.pathExists(distPath))) {
		throw new Error('./dist directory does not exits');
	}
	const appscriptPath = path.join(distPath, './appsscript.json');
	await fs.writeJSON(appscriptPath, {
		timeZone: 'Etc/GMT',
		exceptionLogging: 'STACKDRIVER',
		runtimeVersion: 'V8',
		oauthScopes,
	});

	// $TEMP/.clasp.json
	const configPath = path.join(os.tmpdir(), '.dreamsheets-scripts.clasp.json');
	const rootDir = path.join(process.cwd(), './dist');

	await fs.writeJSON(configPath, { scriptId, rootDir });

	const claspignoreContent = [
		'**/**',
		'!index.bundle.js',
		'!appsscript.json',
	].join('\n');
	const claspignorePath = path.join(os.tmpdir(), '.claspignore');
	await fs.writeFile(claspignorePath, claspignoreContent);

	// import { execSync } from 'child_process';
	// execSync(`npm exec --yes @google/clasp -- --project "${configPath}" push --force`, { stdio: 'inherit' });

	const argvBkp = [...process.argv];
	process.argv[2] = '--project';
	process.argv[3] = configPath;
	process.argv[4] = 'push';
	process.argv[5] = '--force';

	console.log(
		`Pushing bundle to https://script.google.com/home/projects/${scriptId}/edit ...\n`,
	);
	await import('@google/clasp');
	process.argv = argvBkp;
}
