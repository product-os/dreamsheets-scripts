import { fs, path } from 'zx';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
process.on('unhandledRejection', (err) => {
	throw err;
});

const dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(dirname, '../..');
export async function init(projDir = '') {
	projDir = path.resolve(projDir);
	const projName = path.basename(projDir) ?? 'my-fancy-dreamsheet';

	const oldWd = process.cwd();
	try {
		await fs.ensureDir(projDir);
		process.chdir(projDir);

		// Copy over template files
		const templateDir = path.join(rootDir, 'template');

		const add = async (templateFile: string, newName = templateFile) => {
			if (!templateFile) {
				return;
			}

			const templatePath = path.join(templateDir, templateFile);
			const projFilePath = path.join(projDir, newName);

			if (!(await fs.pathExists(projFilePath))) {
				await fs.copy(templatePath, projFilePath);
			} else {
				console.warn(
					`Skipping: Project file ${templateFile} already exists in ${path.dirname(
						templatePath,
					)}`,
				);
			}
		};

		const srcDir = path.join(projDir, './src');
		await fs.ensureDir(srcDir);

		await add('src/index.spec.ts');
		await add('src/index.ts');

		//
		await add('.editorconfig');
		await add('LICENSE');
		await add('tsconfig.template.json', 'tsconfig.json');
		await add('README.md');
		await add('repo.yml');

		// the following is equivalent to `await add('template-package.json', 'package.json')`
		const templatePkgPath = path.join(templateDir, 'template-package.json');
		const templatePkg = await fs.readJSON(templatePkgPath, {
			encoding: 'utf8',
		});
		templatePkg['name'] = projName;
		const { version } = await fs.readJSON(path.join(rootDir, 'package.json'), {
			encoding: 'utf8',
		});
		templatePkg['devDependencies'] = {
			...templatePkg['devDependencies'],
			'dreamsheets-scripts': `^${version}` ?? 'latest',
		};

		const projPkgFilePath = path.join(projDir, 'package.json');
		if (!(await fs.pathExists(projPkgFilePath))) {
			await fs.writeJSON(projPkgFilePath, templatePkg, {
				encoding: 'utf8',
				spaces: 2,
			});
		} else {
			console.warn(
				`Skipping: Project file package.json already exists in ${path.dirname(
					templatePkgPath,
				)}`,
			);
		}

		// Initialize git repo if necessary
		const rollbackGit = async () => {
			try {
				fs.removeSync(path.join(projDir, '.git'));
			} catch (_) {
				// skip
			}
		};

		if (!gitIsInstalled()) {
			console.warn(
				'WARNING: Git is not installed. Install it from https://git-scm.com/download. Proceeding without it ...',
			);
			return;
		}

		// add .gitignore from templateDir
		await add('gitignore', '.gitignore');

		try {
			execSync('git init', { stdio: 'ignore' });
		} catch (e) {
			console.warn('Git repo not initialized', e);
			await rollbackGit();
			return;
		}

		// npm install
		try {
			execSync('npm install --no-audit', { stdio: 'inherit' });
		} catch (e) {
			console.warn('Failed install npm dependencies', e);
			try {
				fs.removeSync(path.join(projDir, 'node_modules'));
			} catch (_) {
				// skip
			}
		}

		try {
			execSync('git add --all', { stdio: 'ignore' });
			execSync('git commit -m "Initialize project using Create Dreamsheet"', {
				stdio: 'ignore',
			});
		} catch (e) {
			// We couldn't commit in already initialized git repo,
			// maybe the commit author config is not set.
			// In the future, we might supply our own committer
			// like Ember CLI does, but for now, let's just
			// remove the Git files to avoid a half-done state.
			console.warn('Git commit not created', e);
			console.warn('Removing .git directory...');
			await rollbackGit();
		}
		console.log('SCAFFOLDING SUCCESSFUL!!');
	} catch (err) {
		throw err;
	} finally {
		process.chdir(oldWd);
	}
}

///
// function isInGitRepo() {
//   try {
//     execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
//     return true;
//   } catch (e) {
//     return false;
//   }
// }

function gitIsInstalled() {
	try {
		execSync('git --version', { stdio: 'ignore' });
		return true;
	} catch (e) {
		console.warn('Git is not installed', e);
		return false;
	}
}
