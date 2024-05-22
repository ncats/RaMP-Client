/* eslint-disable */


const esModules = ['d3-selection', 'd3-axis','d3-scale','d3-format','d3-array'].join('|');

export default {
  displayName: 'features-ramp-ramp-about',
  preset: '../../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {},
  coverageDirectory: '../../../../coverage/libs/features/ramp/ramp-about',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$)'
  ],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  moduleNameMapper: {
    'd3': 'node_modules/d3/dist/d3.min.js',
    'd3-selection': 'node_modules/d3-selection/dist/d3-selection.min.js',
    'd3-scale': 'node_modules/d3-scale/dist/d3-scale.min.js',
    'd3-format': 'node_modules/d3-format/dist/d3-format.min.js',
    'd3-array': 'node_modules/d3-array/dist/d3-array.min.js',
    'd3-axis': 'node_modules/d3-axis/dist/d3-axis.min.js'
  }
};
