import type { Config } from 'jest';
import dotenv from 'dotenv';

dotenv.config();

const config: Config = {
  projects: [
    {
      preset: 'jest-expo/ios',
      testEnvironment: 'node',
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
      setupFiles: ['<rootDir>/jest.setup.js'],
      testMatch: [
        '<rootDir>/repositories/*.test.{ts,tsx}',
        '<rootDir>/hooks/*.test.{ts,tsx}',
      ],
      transformIgnorePatterns: [
        'node_modules/(?!(jest-)?react-native|expo|@expo/.*|@react-navigation/.*|@react-native/.*)',
      ],
    },
    {
      preset: 'jest-expo/web',
      testEnvironment: 'jsdom',
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
      setupFiles: ['<rootDir>/jest.setup.js'],
      testMatch: [
        '<rootDir>/repositories/*.test.{ts,tsx}',
        '<rootDir>/hooks/*.test.{ts,tsx}',
      ],
      transformIgnorePatterns: [
        'node_modules/(?!(jest-)?react-native|expo|@expo/.*|@react-navigation/.*|@react-native/.*)',
      ],
    },
  ],
};

export default config;