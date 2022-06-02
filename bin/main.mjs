#!/usr/bin/env node
process.on('unhandledRejection', (err) => {
	throw err;
});
import 'dotenv/config';
import { push, build, test, init } from '../dist/index.mjs';
import { VERSION } from '../dist/constants.mjs';
import webpackConfig from '../config/webpack.config.mjs';
import jestConfig from '../config/jest.config.cjs';
import husky from 'husky';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const NOP = () => {
	/* noop */
};
const DEFAULT_HUSKYDIR =
	'./node_modules/dreamsheets-scripts/config/project.husky';

const IS_DEBUG_ENV =
	process?.env?.NODE_ENV?.toLowerCase() === 'dev' ||
	process?.env?.NODE_ENV?.toLowerCase() === 'development';

await yargs(hideBin(process.argv))
	.usage('Usage: $0 <command> [options]')
	.command(
		'init <projectNameOrPath>',
		'initializes/hydrates the codebase and installs dependancies',
		(y) =>
			y.option('package-version', {
				alias: 'p',
				default: VERSION,
				type: 'string',
				describe:
					'Version of package to add to package.json devDependancies e.g. "^1.2.3" or "file:../foobar"',
				coerce: (p) => (p === '' ? undefined : p),
			}),
		async ({ projectNameOrPath, packageVersion }) =>
			init(projectNameOrPath, { version: packageVersion, debug: IS_DEBUG_ENV }),
	)
	.command('prepare [husky-dir]', false, NOP, ({ huskyDir }) =>
		husky.install(huskyDir ?? DEFAULT_HUSKYDIR),
	)
	.command('test', 'runs unit tests', NOP, async () => test(jestConfig))
	.command(
		'build',
		'builds the source code into a single bundle located at in readiness for deployment',
		NOP,
		async () => build(webpackConfig),
	)
	.command(
		'push [script-id]',
		'deploys the bundled code into a live spreadsheet specified using the script-id',
		NOP,
		async ({ scriptId: argScriptId }) => {
			const scriptId = argScriptId ?? process?.env.DSX_SCRIPT_ID;
			if (!scriptId) {
				console.error(
					'Error: To push, please provide a `script-id` via a command-line argument or environment variable',
				);
				process.exit(1);
			}
			return push(scriptId);
		},
	)
	.demandCommand(
		1,
		1,
		'Error: Please specify a Command. See usage above',
		'Error: Please specify a Command. See usage above',
	)
	.strict()
	.scriptName('dsx')
	.help('help')
	.alias('help', 'h')
	.parseAsync();
