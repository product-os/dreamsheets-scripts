import GasPlugin from 'gas-webpack-plugin';
import path from 'path'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export default {
	mode: 'development',
	entry: './src/index.ts',
	devtool: false,
	output: {
		filename: 'index.bundle.js',
		path: path.join(process.cwd(), "./dist"),
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: require.resolve('ts-loader'),
			},
		],
	},
	resolve: {
		extensions: ['.js', '.ts'],
	},
	plugins: [
		new GasPlugin({
			autoGlobalExportsFiles: ['src/index.ts']
		})
	],
}
