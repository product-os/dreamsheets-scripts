#!/usr/bin/env node

// require('../dist/index.js')
// await import('../dist/index.mjs')
// import '../dist/index.mjs';

process.on('unhandledRejection', err => { throw err })

import { push, build, test } from '../dist/index.mjs'
import webpackConfig from '../config/webpack.config.mjs'
import jestConfig from '../config/jest.config.cjs'

import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';

const NOP = () => {}
await yargs(hideBin(process.argv))
	.command('push <scriptId>', 'push the bundle', NOP, async ({ scriptId }) => await push(scriptId))
	.command('build', 'build the source', NOP, async () => build(webpackConfig))
	.command('test', 'test the source', NOP, async () => test(jestConfig))
	.help('h')
	.parseAsync()
