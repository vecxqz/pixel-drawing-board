## 简介

Pixel Art 是一个像素艺术创作工具
[在线预览](https://binarystudio.cc/)

## 构成

- 依赖
  - typescript
  - vue-cli
  - vue3
  - vue-router
  - vuex
  - element-plus
- CI/CD
  - github actions

## 功能支持

- 画布
  - 工具类
    - [√] 画笔工具
    - [√] 镜像绘制工具
    - [√] 橡皮擦工具
    - [√] 直线工具
    - [√] 矩形工具
    - [√] 圆形工具
    - [√] 油漆桶工具
    - [√] 吸管工具
    - [√] 移动工具
    - [√] 选择工具
    - [×] 渐变工具
  - 画布类
    - 图层操作
      - [√] 图层创建
      - [√] 图层重命名
      - [√] 图层上下移动
      - [√] 图层上下合并
      - [√] 图层删除
      - [√] 图层复制
    - 页面操作
      - [√] 页面创建
      - [√] 页面左右移动
      - [√] 页面删除
      - [√] 页面复制
  - 文件类
    - [√] 画布大小自定义
    - [√] 画布存储至服务器
    - [√] 画布存储至本地浏览器
    - [√] 读取画布数据加载
    - [×] 画布裁剪
    - [√] 画布导出
      - [√] png 图片
      - [√] gif 图片
    - [√] 撤销
    - [√] 还原
    - [×] 将已绘制的画布的数据导入到其他画布

## 未来

1. 代码优化
2. UI 优化

## 开发

```bash
# 克隆项目
git clone https://github.com/vecxqz/to-do-in-2020.git

# 进入项目目录
cd pixel-art

# 安装依赖
npm install

# 运行服务
npm run serve
```

## 发布

```bash
# 构建代码
npm run build
```

## Lciense

[GPL-3.0](https://github.com/vecxqz/to-do-in-2020/blob/develop/dev/LICENSE)  
Copyright (C) <2020> \<vecxqz>
