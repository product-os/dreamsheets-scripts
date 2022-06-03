import { fs, path } from 'zx';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export const ROOT_DIR = path.resolve(dirname, '..');
export const { version: VERSION }: { version?: string } = await fs.readJSON(
	path.join(ROOT_DIR, 'package.json'),
	{
		encoding: 'utf8',
	},
);

export const DEFAULT_OAUTH_SCOPE =
	'https://www.googleapis.com/auth/spreadsheets';
