# v-lazy


替换 Vue 模板中的`v-lazy`，比如

```html
<img v-lazy="img">

<!-- 将转为 -->
<img :src="img">
```

如果提供 `options.urlHandler`，则用 `urlHandler` 包裹，比如：

```html
<img v-lazy="img"> 

<!-- 将转为 -->
<img :src="getCompressUrl(img)">
```

如果提供 `size` 和 `urlHandler`，则向 `urlHandler` 传递 `size` 参数，比如：

```html
<img v-lazy="img" size="50">

<!-- 将转为 -->
<img :src="getCompressUrl(img, 50, 50)">
```


以下几种`size`都是有效的：

```html
<img v-lazy="src" size="50">
<img v-lazy="src" data-size="50">
<img v-lazy="src" width="50" height="100">
<img v-lazy="src" data-width="50" data-height="100">
```


## 如何使用

1. 先安装 npm 包：

```bash
npm i uni-plugin-light -D
```

2. 在 `vue.config.js` 中添加如下设置：

```js
const V_LAZY_LOADER = 'uni-plugin-light/lib/loader/v-lazy';

module.export = {
  chainWebpack(config) {
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use(V_LAZY_LOADER)
      .loader(V_LAZY_LOADER)
      .end();
  }
}
```
