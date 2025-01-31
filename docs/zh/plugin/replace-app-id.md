# replace-app-id

可用于动态替换小程序编译产物的`project.config.json`中的`appid`，适用于一个子工程下，不同页面属于不同小程序的场景。

## 如何使用

1. 先安装 npm 包：

```bash
npm i uni-plugin-light -D
```

2. 在 `vue.config.js` 中添加如下设置：

```ts
const {
  ReplaceAppIdPlugin,
} = require('uni-plugin-light/lib/plugin');


module.exports = {
  configureWebpack: {
    plugins: [
      new ReplaceAppIdPlugin({
        appId: 'xxx'
      })
    ],
  }
}
```

## 插件参数


| 参数  | 说明              | 类型     | 默认值 |
| ----- | ----------------- | -------- | ------ |
| appId | 将要替换的`appid` | _string_ | -      |

