# rem-to-rpx

将`rem`转为`rpx`插件。

## 如何使用

1. 先安装 npm 包：

```bash
npm i uni-plugin-light -D
```

2. 在 `vue.config.js` 中添加如下设置：

```ts
const {
  RemToRpxPlugin,
} = require('uni-plugin-light/lib/plugin');


module.exports = {
  configureWebpack: {
    plugins: [
      new RemToRpxPlugin({
        whiteList: []
      })
    ],
  }
}
```

## 插件参数


| 参数       | 说明                   | 类型     | 默认值                                   |
| ---------- | ---------------------- | -------- | ---------------------------------------- |
| whiteList  | 不处理的路径白名单列表 | _array_  | -                                        |
| factor     | 转换比例               | _number_ | `100`                                    |
| unit       | 目标单位               | _string_ | `unit`                                   |
| fileSuffix | 要处理的文件后缀名     | _array_  | `['css', 'scss', 'less', 'wxss', 'qss']` |

