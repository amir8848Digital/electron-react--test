import path from 'path';
import { app } from 'electron';
import { isDev } from './util.js';
import { pathToFileURL } from 'url';

export function getPreloadPath() {
  return path.join(
    app.getAppPath(),
    isDev() ? '.' : '..',
    '/dist-electron/preload.cjs'
  );
}

export function getUIPath() {
  return path.join(app.getAppPath(), '/dist-react/index.html');
}

export function getAssetPath() {
  return path.join(app.getAppPath(), isDev() ? '.' : '..', '/src/assets');
}
export function getFormConfigPath(formName: string): string {
  const baseDirectory = path.join(app.getAppPath(), "src", "electron", "forms");
  const filePath = path.join(
        baseDirectory,
        formName,
        `config.json`
      );
  return pathToFileURL(filePath).href;  // Converts path to file:// URL
}