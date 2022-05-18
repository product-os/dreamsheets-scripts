
const path = require('path')

module.exports = {
	transform: {'^.+\\.tsx?$': require.resolve('ts-jest')},
	roots: [path.join(process.cwd(),'src')],
};

