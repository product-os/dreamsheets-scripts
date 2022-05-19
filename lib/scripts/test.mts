import jest from 'jest';
import {Config} from '@jest/types'


// node ./node_modules/dreamsheets-scripts/node_modules/jest/bin/jest.js --config ./node_modules/dreamsheets-scripts/config/jest.config.cjs
export async function test(config: Config.DefaultOptions) {
	const argv = process.argv.slice(3)
	argv.push('--config', JSON.stringify(config));
	argv.push('--watch');
	return jest.run(argv)
}
