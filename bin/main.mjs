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
		'push [scriptId]',
		'push the bundle',
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
	.command('build', 'build the source', NOP, async () => build(webpackConfig))
	.command('test', 'test the source', NOP, async () => test(jestConfig))
	.command(
		'init [projectDir]',
		'initialize the codebase',
		NOP,
		async ({ projectDir }) => init(projectDir),
	)
	.command('prepare [huskyDir]', 'prepare the codebase', NOP, ({ huskyDir }) =>
		husky.install(huskyDir ?? DEFAULT_HUSKYDIR),
	)
	.scriptName('dsx')
	.help('h')
	.parseAsync();
