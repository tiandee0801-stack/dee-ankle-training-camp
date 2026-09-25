# Dee 脚踝运动复训基础营

Dee 个人康复经历与《脚踝运动复训基础营》的响应式产品宣传网站。

- [在线访问 GitHub Pages](https://tiandee0801-stack.github.io/dee-ankle-training-camp/)
- [原网站](https://dee-ankle-foundations.tiandee0801.chatgpt.site/)

## 页面内容

真实康复照片与可切换的经历章节、康复笔记与课程设计、10 关能力地图、每日训练反馈、课程交付、入营条件和常见问题。

网站提供章节目录、图片滚动效果和动效开关，并适配手机与系统的减少动态效果设置。使用原生 HTML、CSS、JavaScript，无需安装依赖或构建。

## 本地运行

```sh
python3 -m http.server 8000 --directory docs
```

打开 http://localhost:8000 。

## 部署

GitHub 仓库 Settings → Pages：选择 **Deploy from a branch**，分支 **main**，目录 **/docs**。推送修改后 GitHub Pages 自动更新。

## 目录

- `docs/index.html`：网页结构与内容
- `docs/style.css`、`experience.css`、`motion.css`：样式与响应式布局
- `docs/experience.js`：章节切换、目录与动效交互
- `docs/photos/`：Dee 提供的本人经历照片
- `docs/recovery-path.svg`：训练路径图形

## 许可与内容说明

网页软件代码（HTML 结构、CSS、JavaScript）采用 [MIT License](LICENSE)。Dee 的照片、姓名与品牌、课程文案和训练内容不在软件许可范围内，详见 [内容许可](CONTENT-LICENSE.md)。

本项目是产品宣传页，不是学员健康记录系统；不包含账号后台、支付、报名数据或内部 SOP。14 天为基础复训启动陪跑周期，不是恢复期限承诺。
