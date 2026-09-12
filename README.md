# 熊帝权的个人主页

面向面试阅读的静态作品主页：暖白与深绿色、可切换角色的规则讲解、项目机制图、工具试用和研究成果。无构建工具、无第三方字体或统计脚本。角色示例为虚构场景，图示为设计讲解，未接入模型或真实题库。关闭 JavaScript 后仍可阅读完整案例。

## 本地查看与修改

使用静态 HTTP 服务打开 `index.html`，以便正确预览内嵌相册及其浏览器存储。正文在 `index.html` 中，主页排版在 `showcase.css` 中，角色交互及嵌入高度处理在 `showcase.js` 中。`style.css` 继续供博客和上下文卡片工具使用。文件修改后刷新页面即可。

## 发布到 GitHub Pages

1. 登录自己的 GitHub，创建一个公开仓库。可以命名为 `personal-homepage`；如需账号根域名主页，则使用 `你的用户名.github.io`。已有同名仓库时先检查内容，避免覆盖原网站。
2. 把本目录内的文件和子目录按原结构上传到仓库根目录并提交，包含 `blog`、`tools` 和 `context-card-source.zip`。不要把整站 ZIP 本身或外面的整个文件夹当作首页上传。
3. 打开仓库 **Settings → Pages**，Source 选择 **Deploy from a branch**，分支选择 **main**，目录选择 **/ (root)**，保存。
4. 等待 Pages 部署完成，使用页面显示的地址访问。普通仓库的网址为 `https://你的用户名.github.io/personal-homepage/`；用户名主页仓库的网址为 `https://你的用户名.github.io/`。

后续修改上述文件并提交即可更新网站。发布设置参考 [GitHub 官方文档](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

网站包含三条产品实践主线、4篇实践文章、上下文卡片小工具和见见面公开体验版。工具代码的 MIT 许可仅覆盖工具范围，文章和个人经历文字保留作者权利。博客 HTML 是展示版，同名 Markdown 便于再编辑；修改时请同步两个版本。

网站仅包含公开职业简介和个人项目概述。详细履历库、电话、私人资料、题库、业务数据和本地工作文件不属于此仓库内容。

## 线上入口

主页：https://qingmingyiyang.github.io/
仓库：https://github.com/qingmingyiyang/qingmingyiyang.github.io

## 见见面公开体验版

2026-09-11从用户提供的原 Web 原型整理出 `tools/meeting-memories/`：暖色相册界面、日期跳转、照片与视频、文字与地点、本地保存、JSON 备份及确认导入。首页 iframe 只浏览虚构示例，完整页面提供个人记录功能。三幅 SVG 为此次制作的示例插画。未接入模型，不读取旧版存储，不兼容旧版 ZIP；原工具及私人资料未发布。

主页文字同步调整为更自然的第一人称叙述；已有研究数字、AI 实现分工与原型验证边界保持原口径。



## Chriptmas OS 原型截图

`assets/projects/` 的三张 PNG 来自本人提供的 2026.09 原型作品集，分别展示工作台、入库整理与项目大脑。原图未改内容，首页按一大两小排列，移动端依次展开，点击打开可关闭的大图对话框；无 JavaScript 时直接打开原图。图片用于说明封存原型的界面与设计状态，不作为完整 Agent 流程通过验证的证据。个人日期记录、候选人资料和原始作品集压缩包未纳入本站。

## 见见面界面截图

首页见见面案例加入日历回看、当天回忆和影像放大3张实际浏览器截图，来自本仓库公开体验版。图中回忆虚构、配图为示例插画。截图未改绘，复用统一图片查看对话框；在线日历仍可直接体验。图片位于`assets/projects/meeting-*.png`，更新功能后按需重新截图。


## 三条AI产品实践主线（2026-09-12）

首页以业务AI、个人Agent探索、研究到产品三章展开，补充2024—2026历程、模块式案例及实践长文。章节背景描述用户任务，具体模块承载本人设计、AI/规则/人工分工、成果与范围取舍。产业研究作为洞察来源，未改称AI研究。

首页使用journey.css与journey.js；showcase.js复用原角色讲解与截图对话框，原showcase.css保留为旧版样式。博客与两个工具继续沿用各自样式。6张项目截图保持原内容，3组讲解控件分别为角色、工作台范围、消费场景。演示与后续计划均有明确标签；无真实模型调用和新增效果指标。

字体IBM Plex Mono由Google Fonts官方仓库提供，以SIL OFL分发，版权与许可见assets/fonts/OFL-IBMPlexMono.txt。原始来源：https://github.com/google/fonts/tree/main/ofl/ibmplexmono 。字体本地托管，页面不向字体服务发送请求。

新文章：blog/building-my-ai-path.html及Markdown，依据本人确认素材、AI协助成文。404.html提供返回首页入口。

## 全站文字修订（2026-09-12）

按本人补充的使用体验和表达要求，重新润色首页标题、项目介绍、截图说明、交互文案及四篇文章。取消独立AI Native思考区，将上下文、AI协作、发现盲点和人的选择写进具体项目。首页#ai-native保留为协作方式的兼容锚点，文章同名锚点指向已有实践段落。

改写重点是说明谁做了什么、为什么这么做，减少生造短语、口号、刻意对仗及自我评价。项目数字、实际分工、功能状态与图片内容保留。四篇博客以Markdown与HTML同步维护；本轮没有修改两个工具的功能。
