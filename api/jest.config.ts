import type { Config } from 'jest';
const config: Config = { projects: [
  { displayName: 'unit', preset: 'ts-jest/presets/default-esm', testMatch: ['<rootDir>/tests/unit/**/*.test.ts'], extensionsToTreatAsEsm: ['.ts'], moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' } },
  { displayName: 'api', preset: 'ts-jest/presets/default-esm', testMatch: ['<rootDir>/tests/api/**/*.test.ts'], extensionsToTreatAsEsm: ['.ts'], setupFiles: ['<rootDir>/tests/helpers/testEnv.ts'], moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' } }
] };
export default config;
