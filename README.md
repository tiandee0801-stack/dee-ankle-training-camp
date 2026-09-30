# Dee 脚踝运动复训基础营

Dee 个人康复经历与《脚踝运动复训基础营》的响应式产品宣传网站。

- [在线访问 GitHub Pages](https://tiandee0801-stack.github.io/dee-ankle-training-camp/)
- [原网站](https://dee-ankle-foundations.tiandee0801.chatgpt.site/)

## 页面内容

真实康复照片与可切换的经历章节、康复笔记与课程设计、10 关能力地图、每日训练反馈、课程交付、入营条件和常见问题。

网站以 Dee 的个人康复故事为主线，使用黑色、荧光绿、暖白与蓝色组成视觉层次。六张真实照片各出现一次，配有康复经历切换、分阶段训练地图、身体反馈卡、章节目录、滚动动效和动效开关。

支持手机布局、键盘操作与系统的减少动态效果设置。使用原生 HTML、CSS、JavaScript，无需安装依赖或构建；图片和资源随站点提供，不依赖外部字体或脚本。

## 本地运行

```sh
python3 -m http.server 8000 --directory docs
```

打开 http://localhost:8000 。

## 部署

GitHub 仓库 Settings → Pages：选择 **Deploy from a branch**，分支 **main**，目录 **/docs**。推送修改后 GitHub Pages 自动更新。

## 目录

- `docs/index.html`：网页结构与内容
- `docs/editorial.css`：新版视觉样式、响应式布局与动效
- `docs/editorial.js`：故事、训练路径、身体反馈的切换与目录交互
- `docs/photos/`：Dee 提供的本人经历照片

## 许可与内容说明

网页软件代码（HTML 结构、CSS、JavaScript）采用 [MIT License](LICENSE)。Dee 的照片、姓名与品牌、课程文案和训练内容不在软件许可范围内，详见 [内容许可](CONTENT-LICENSE.md)。

本项目是产品宣传页，不是学员健康记录系统；不包含账号后台、支付、报名数据或内部 SOP。14 天为基础复训启动陪跑周期，不是恢复期限承诺。
