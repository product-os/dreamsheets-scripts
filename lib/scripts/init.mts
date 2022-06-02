import { fs, path, $, quiet } from 'zx';
import { execSync } from 'child_process';
import { VERSION, ROOT_DIR } from '../constants.mjs';

const O = { version: VERSION, debug: false };
export async function init(
	proj: string,
	{ version = O.version, debug = false }: typeof O = O,
) {
	$.verbose = debug;
	if (typeof proj !== 'string' || !proj.length) {
		throw new Error('Please provide a valid project directory');
	}

	const projDir = path.resolve(proj);
	const projName = path.basename(projDir) ?? 'my-fancy-dreamsheet';

	const oldWd = process.cwd();
	try {
		await fs.ensureDir(projDir);
		process.chdir(projDir);

		// Copy over template files
		const templateDir = path.join(ROOT_DIR, 'template');

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
					`Warning: Skipping creation of file \`${path.join(
						proj,
						newName,
					)}\` since it already exists.`,
				);
			}
		};

		const srcDir = path.join(projDir, './src');
		await fs.ensureDir(srcDir);

		await add('src/index.spec.ts');
		await add('src/index.ts');
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
		const pkgVersion = `${version}` ?? 'latest';
		console.log(
			`\n  ... Using package version "dreamsheets-scripts@${pkgVersion}"\n`,
		);
		templatePkg['devDependencies'] = {
			...templatePkg['devDependencies'],
			'dreamsheets-scripts': pkgVersion,
		};

		const projPkgFilePath = path.join(projDir, 'package.json');
		if (!(await fs.pathExists(projPkgFilePath))) {
			await fs.writeJSON(projPkgFilePath, templatePkg, {
				encoding: 'utf8',
				spaces: 2,
			});
		} else {
			console.warn(
				`Warning: Skipping the creation of file \`${path.join(
					proj,
					'package.json',
				)}\` since it already exists.`,
			);
		}

		// Initialize git repo if necessary
		const rollbackGit = async () => {
			try {
				fs.removeSync(path.join(projDir, '.git'));
				console.warn('Removing .git directory...');
			} catch (_) {
				// skip
			}
		};

		if (!(await gitIsInstalled())) {
			console.warn(
				'WARNING: Git is not installed on this machine. Install it from https://git-scm.com/download. Proceeding without it ...',
			);
			return;
		}

		// add .gitignore from templateDir
		await add('gitignore', '.gitignore');

		try {
			await $`git init`;
		} catch (e) {
			console.warn(`Git repo not initialized. ${e}`);
			await rollbackGit();
			return;
		}

		// npm install
		try {
			// await $`npm install --no-audit`.pipe(process.stdout) // is not displaying the spinner
			execSync('npm install --no-audit', { stdio: 'inherit' });
		} catch (e) {
			console.warn(`Warning: Skipping installation of npm dependencies. ${e}`);
			try {
				fs.removeSync(path.join(projDir, 'node_modules'));
			} catch (_) {
				// skip
			}
		}

		// Add an initial commit if necessary
		if (await hasInitialCommit()) {
			return;
		}
		try {
			await $`git add --all`;
			await $`git commit -m "Initialize project using Create Dreamsheet"`;
		} catch (e) {
			// We couldn't commit in already initialized git repo,
			// maybe the commit author config is not set.
			// In the future, we might supply our own committer
			// like Ember CLI does, but for now, let's just
			// remove the Git files to avoid a half-done state.
			console.warn(`Initial git commit not created.  ${e}`);

			await rollbackGit();
		}

		console.log('\nInitialization is complete.\nEnjoy your new project!!\n');
	} catch (err) {
		throw err;
	} finally {
		process.chdir(oldWd);
	}
}

async function gitIsInstalled() {
	return !(await quiet($`git --version`).exitCode);
}
async function hasInitialCommit() {
	return !(await quiet($`git rev-parse HEAD`).exitCode);
}

// async function isInGitRepo() {
//   try {
//     await $`git rev-parse --is-inside-work-tree`
//     return true;
// 	} catch (e) {
// 		console.warn(`Directory is not a Git repo. ${e}`);
//     return false;
//   }
// }
