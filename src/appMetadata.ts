import packageJson from '../package.json';

export const PACKAGE_VERSION = packageJson.version;

export const APP_VERSION = PACKAGE_VERSION
  .toUpperCase()
  .replace(/-BETA\./u, '-BETA-');
