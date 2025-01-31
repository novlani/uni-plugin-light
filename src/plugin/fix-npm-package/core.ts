import * as path from 'path';
import { updateAssetSource, saveJsonToLog } from '../../helper/index';

export function replaceAbsolutePath({
  source,
  path,
  key,
}) {
  const reg = new RegExp(`(?<=__webpack_require__\\(")(${path}.*?)(?="\\))`);
  const newSource = source.replace(reg, key);
  return newSource;
}

export function findKey(obj) {
  const prodReg = /\w\["default"\]\s*=\s*\w\.exports/;
  const devReg = /__webpack_exports__\["default"\]\s*=\s*\(component\.exports\)/;

  // eslint-disable-next-line no-restricted-syntax
  for (const key in obj) {
    const content = obj[key];
    if (prodReg.test(content) || devReg.test(content)) {
      return key;
    }
  }
  throw new Error('没找到对应的key，无法替换绝对路径');
}


export function fixNpmPackage(assets) {
  const keys = Object.keys(assets);
  const handlesAssets: Array<{asset: string, hash: string}> = [];

  for (const item of keys) {
    if (item.indexOf('node-modules') > -1 && item.endsWith('.js')) {
      const source = assets[item].source?.()?.toString();
      const cwd =  process.cwd()
        .split(path.sep)
        .join('/');

      if (source.indexOf(cwd) === -1) continue;

      global.webpackJsonp = [];
      // eslint-disable-next-line no-eval
      eval(source);
      const comps = global.webpackJsonp?.[0]?.[1];
      if (!comps) continue;

      // const key = Object.keys(comps)[0];
      const key = findKey(comps);
      if (!key) continue;

      const newSource = replaceAbsolutePath({
        source,
        path: cwd,
        key,
      });

      // console.log(`[FIX NPM PACKAGE] 将 ${item} 中的绝对路径替换为${key}`);
      handlesAssets.push({
        asset: item,
        hash: key,
      });
      updateAssetSource(assets, item, newSource);
    }
  }

  saveJsonToLog(handlesAssets, 'fix-npm-package.json');
}
