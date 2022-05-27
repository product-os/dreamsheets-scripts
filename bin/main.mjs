#!/usr/bin/env node
process.on('unhandledRejection', (err) => {
	throw err;
});
import 'dotenv/config';
import { push, build, test, init } from '../dist/index.mjs';
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
await yargs(hideBin(process.argv))
	.usage('Usage: $0 <command> [options]')
	.command(
		'init <projectNameOrPath>',
		'initializes/hydrates the codebase and installs dependancies',
		NOP,
		async ({ projectNameOrPath }) => init(projectNameOrPath),
	)
	.command('prepare [huskyDir]', false, NOP, ({ huskyDir }) =>
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
		'push [scriptId]',
		'deploys the bundled code into a live spreadsheet specified using the scriptId',
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
