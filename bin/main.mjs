#!/usr/bin/env node
process.on('unhandledRejection', err => { throw err })
import 'dotenv/config'
import { push, build, test } from '../dist/index.mjs'
import webpackConfig from '../config/webpack.config.mjs'
import jestConfig from '../config/jest.config.cjs'

import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';

const NOP = () => {}
await yargs(hideBin(process.argv))
	.command('push [scriptId]', 'push the bundle', NOP, async ({ scriptId }) => push(scriptId ?? process?.env.DSX_SCRIPT_ID))
	.command('build', 'build the source', NOP, async () => build(webpackConfig))
	.command('test', 'test the source', NOP, async () => test(jestConfig))
	.help('h')
	.parseAsync()
