#!/usr/bin/env node

// require('../dist/index.js')
// await import('../dist/index.mjs')
// import '../dist/index.mjs';

process.on('unhandledRejection', err => { throw err })

import { push, build } from '../dist/index.mjs'
import config from '../config/webpack.config.mjs'

import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';

const NOP = () => {}
await yargs(hideBin(process.argv))
	.command('push <scriptId>', 'push the bundle', NOP, async ({ scriptId }) => await push(scriptId))
	.command('build', 'build the source', NOP, async () => build(config))
	.help('h')
	.parseAsync()


// await build()
// await push("1dIlULL84YOBBep-0pg4S5SIb4039LQrBj1YsEGfQpZjKN7TpevbriNIA")
