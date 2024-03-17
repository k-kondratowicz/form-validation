import type { Config } from '@jest/types';

const ROOT_PATH = '<rootDir>';
const SRC_PATH = `${ROOT_PATH}/src`;
const TESTS_PATH = `${ROOT_PATH}/tests`;

const config: Config.InitialOptions = {
	roots: [TESTS_PATH, SRC_PATH],
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	verbose: true,
	moduleDirectories: ['node_modules', ROOT_PATH, TESTS_PATH, SRC_PATH],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest',
	},
	moduleNameMapper: {
		'@/(.*)': `${SRC_PATH}/$1`,
	},
	testPathIgnorePatterns: ['/node_modules/', `${TESTS_PATH}/helpers`],
	coveragePathIgnorePatterns: ['/node_modules/', `${TESTS_PATH}/helpers`],
};
export default config;
