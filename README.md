## 概览

ide-code-editor

## 本地开发

首先安装依赖：
```shell
npm install

## 安装 peerDependencies 依赖包
npm install styled-components@4.x antd@3.x mobx@4.x mobx-react@5.x mobx-state-tree@3.x react@16.x react-dom@16.x ss-tree@1.x
```

访问 demo 地址： http://localhost:9000
```shell
npm run dev
```

也可访问 [storybook](https://github.com/storybooks/storybook) 参考具体的使用案例：http://localhost:9001/
```shell
npm run storybook
```

## 运行测试用例

使用 [jest](https://jestjs.io) 进行测试，执行：

```shell
npm test
```

## 打包发布

普通的 npm 发布即可，记得发布前需要手动打包：

```shell
npm run build && npm publish
```

