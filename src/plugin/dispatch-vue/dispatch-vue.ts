
import * as path from 'path';
import { analyzeComponent } from './analyze-component';
import { fixNpmPackage } from '../fix-npm-package/core';
import { saveLoaderLog } from '../../helper/loader-log';
import { createLogDir, updateAssetSource, removeFirstSlash } from '../../helper/index';
import { formatTime, findReplaceMap, replaceAllPolyfill } from './helper';
import { PLATFORM_MAP } from '../../helper/config';

replaceAllPolyfill();


export class DispatchVuePlugin {
  options: object;
  useFixNpm: false;
  insertRequireVendor: false;
  startTime: number;

  postFix: {
    html: '.wxml' | '.qml'
    css: '.wxss' | '.qss'
  };

  constructor(options) {
    this.options = options;
    this.useFixNpm = options?.useFixNpm || true;
    this.insertRequireVendor = options?.insertRequireVendor || false;
    this.startTime = 0;

    this.postFix = {
      html: '.wxml',
      css: '.wxss',
    };

    if (process.env.UNI_PLATFORM === PLATFORM_MAP.MP_QQ) {
      this.postFix = {
        html: '.qml',
        css: '.qss',
      };
    }

    createLogDir();
  }

  apply(compiler) {
    compiler.hooks.emit.tap('moveComponentPlugin', (compilation) => {
      this.startTime = Date.now();
      console.log('[Dispatch Vue] Plugin Start Time: ', formatTime(this.startTime));

      try {
        const { assets } = compilation;
        const {
          parsedReplaceRefList,
          movingComponents,
        } = analyzeComponent(this.options) || {};
        if (!movingComponents || !parsedReplaceRefList) {
          return;
        }

        this.copyComponents(assets, movingComponents);
        this.modifyRef(assets, parsedReplaceRefList);
        this.deleteComponents(assets, movingComponents);
        if (this.useFixNpm) {
          fixNpmPackage(assets);
        }

        const endTime = Date.now();

        console.log('[Dispatch Vue] Plugin End Time: ', formatTime(endTime));
        console.log('[Dispatch Vue] Plugin Took Time: ', `${endTime - this.startTime}ms`);

        saveLoaderLog();
      } catch (err) {
        console.log('[Dispatch Vue] err', err);
      }
    });
  }

  copyComponents(assets, movingComponents) {
    for (const item of movingComponents) {
      const { sourceRef, targetRef, subPackage } = item;
      const origin = removeFirstSlash(sourceRef);
      const target = removeFirstSlash(targetRef);

      const vendor = [subPackage, 'common/vendor.js'].join('/');
      let insertCode = '';

      if (assets[vendor] && this.insertRequireVendor) {
        console.log('[copyComponents] 存在vendor', vendor);
        const vendorRelativePath = path.relative(path.dirname(path.resolve(target)), path.resolve(vendor))
          .split(path.sep)
          .join('/');
        console.log('[copyComponents] vendorRelativePath', vendorRelativePath);

        insertCode = `require('${vendorRelativePath}');`;
      }
      this.addCompChunk(assets, origin, target, '.js', insertCode);
      this.addCompChunk(assets, origin, target, '.json');
      this.addCompChunk(assets, origin, target, this.postFix.html);
      this.addCompChunk(assets, origin, target, this.postFix.css);
    }
  }

  deleteComponents(assets, movingComponents) {
    for (const item of movingComponents) {
      const { sourceRef } = item;
      const origin = removeFirstSlash(sourceRef);

      this.deleteFile(assets, origin, '.js');
      this.deleteFile(assets, origin, '.json');
      this.deleteFile(assets, origin, this.postFix.html);
      this.deleteFile(assets, origin, this.postFix.css);
    }
  }

  deleteFile(assets, name, postfix) {
    delete assets[name + postfix];
  }

  addCompChunk(assets, origin, target, postfix, insertCode = '') {
    /**
     * assets 的 keys 列表示例，可以看到没有前面的 `/`
     *
     * [
     *   "views/sche/cycle-set.wxml",
     *   "views/match-detail/publish-news.wxml",
     *   "wxcomponents/vant/mixins/basic.d.ts",
     *   "local-component/module/tip-match/tip-match-detail-group-qrcode/index.json",
     * ]
     */

    if (assets[origin + postfix]) {
      let source = assets[origin + postfix].source().toString();
      if (postfix === '.js') {
        source = `${insertCode}${source}`;
      }
      updateAssetSource(assets, target + postfix, source);
    }
  }

  formatReplaceRefList(replaceRefList) {
    const refMap = replaceRefList.reduce((acc, item) => {
      const { 0: origin, 1: target, 2: subPackage } = item;
      const list = [removeFirstSlash(origin), removeFirstSlash(target)];

      if (acc[subPackage]) {
        acc[subPackage].push(list);
      } else {
        acc[subPackage] = [list];
      }
      return acc;
    }, {});
    return refMap;
  }

  modifyRef(assets, parsedReplaceRefList) {
    const refMap = this.formatReplaceRefList(parsedReplaceRefList);
    replaceAllPolyfill();

    for (const key of Object.keys(assets)) {
      const value = assets[key];
      const replaceList = findReplaceMap(key, refMap);

      if (replaceList?.length && (key.endsWith('.js') || key.endsWith('.json'))) {
        let source = value.source().toString();

        for (const replaceItem of replaceList) {
          source = source.replaceAll(`${replaceItem[0]}'`, `${replaceItem[1]}'`);
          source = source.replaceAll(`${replaceItem[0]}"`, `${replaceItem[1]}"`);
          source = source.replaceAll(`${replaceItem[0]}-create-component'`, `${replaceItem[1]}-create-component'`);
          source = source.replaceAll(`${replaceItem[0]}-create-component"`, `${replaceItem[1]}-create-component"`);
        }

        updateAssetSource(assets, key, source);
      }
    }
  }
}

