# Tally-Book
<div style="display:flex">

![home](/screenshot/home.png)

![modal](/screenshot/modal.png)
</div>

- `vite`
- `vue@3`
- `tailwind`
- `typescript`
- `element-plus`
- `sass`
## Feature
- 前端读取CSV文件
- 日期过滤（无数据日期不可选）
- 分类过滤
- 日期/金额排序
- 新增账单
- 本地缓存数据
- 动态计算合计数据
## 运行要求
> 直接运行开发环境 or 打包📦
- `nodejs`@16.14
  http://nodejs.cn/download/
  ```javascript
  // 或者使用homebrew
  brew install node
  ```
- 包管理器`yarn`
  ```javascript
  npm i yarn -g
  ```

- 安装依赖
  ```javascript
  cd ./tally-book
  yarn
  // 等待安装完成
  ```

- 进入开发模式
  ```javascript
  yarn dev
  ```
  默认服务器地址为[http://localhost:3000/](http://localhost:3000/)
