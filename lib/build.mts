import { fs } from 'zx';
import webpack, { Configuration, Stats } from 'webpack';

const compile = (cfg: Configuration) =>
	new Promise<Stats | undefined>((resolve, reject) => {
		webpack(cfg).run((err, res) => {
			if (err) {
				return reject(err);
			}

			if (res?.compilation?.errors?.length) {
				reject(res.compilation.errors[0]);
			}
			resolve(res);
		});
	});

export async function build(config: Configuration) {
	console.log('Build Started!');
	await fs.emptyDir(config?.output?.path as string);

	await compile(config);
	console.log('Build Completed!');
}
