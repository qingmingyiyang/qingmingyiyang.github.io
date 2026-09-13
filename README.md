# 熊帝权的个人主页

[公开主页](https://qingmingyiyang.github.io/) · [源码仓库](https://github.com/qingmingyiyang/qingmingyiyang.github.io)

首页介绍本人，并围绕作品和经历组织内容。读者先浏览作品外观、用途和经历概况，再进入详情页了解设计、实际产物与修改过程。简历和完整经历素材库在本地投递材料中维护。

## 页面结构

- `index.html`：个人介绍、四个作品入口、一个开源小工具、经历和教育概况。
- `projects/ai-question-tool.html`：腾讯 AI 出题工具的需求、明暗题卡、自动出题、权限与角色演示。
- `projects/chriptmas-os.html`：个人知识与 Agent 工作台原型、截图、范围取舍和下一步验证计划。
- `projects/meeting-memories.html`：见见面截图、产品流程与公开体验版入口。
- `projects/echo-world.html`：回响世界六回合规则原型，以及 AI 小镇的后续想法。
- `experience.html`：实习、区域产业研究、定性定量研究、校园与比赛经历。
- `notes.html`：五篇项目记录入口。`blog/`同时维护文章的 HTML 和 Markdown。

2026-09-13首页参考本人提供的版式：左上大标题、右上简短概览、下方四张错落作品卡、底部集中呈现经历。采用浅蓝底、深色文字、白色卡片和少量网格线，保留作品截图。主标题采用本人给出的借助 AI，打造工具。参考图中的学习路线、书籍或技能声明不作为个人经历；文案仍直接讲需要、行动与想法，AI Native观点融入具体项目，不另设思考区。

## 样式与交互

`portfolio.css`提供公共布局；首页单独加载`home-reference.css`，详情与文章沿用`notebook.css`，因此旧首页的绿色面板样式不会叠加到新布局。`portfolio.js`负责导航、截图切换和旧链接兼容；`showcase.js`复用角色演示、原图对话框和相册嵌入高度同步。旧`journey.css`、`journey.js`和`showcase.css`保留为历史样式文件，当前主页及新详情页不加载。

博客和工具继续使用已有样式。无需构建依赖，使用静态 HTTP 服务即可预览；没有统计脚本或外部字体请求。主页卡片使用普通链接，截图缩略图在关闭 JavaScript 时仍可打开原图；角色演示和截图切换需要 JavaScript。

旧链接`#business`、`#exploration`、`#meeting`、`#research`等会前往相应详情；首页仍保留兼容锚点。`#works`和`#experience`是当前主导航。

## 截图、工具与事实边界

`assets/projects/`保留六张实际截图。Chriptmas OS 的三张来自2026.09原型作品集；见见面的三张来自本站公开体验版，回忆与插画均为示例。首页题卡和回响世界封面为代码绘制的设计示意，均标明，不冒充原系统截图。

腾讯角色演示使用虚构教学题，未连接真实题库或模型。107道题、3批次、20个行业、100+次使用和面向200+学生分别表述，不换算为去重用户、完成考核量或效果提升。产业研究保留8个项目、主导5个、105天、19地区、26份报告、4套问卷和100余人实地调研口径；研究不改写为AI科研，尚无案例产品的经营结果数据。

Chriptmas 整体 Agent 目标尚未达成，知识提取归档的新流程为下一步计划。见见面与回响世界由 AI 协作开发，不代表运行时已经调用大模型。游戏详情页展示设计说明，不提供在线游戏。

- `tools/context-card/`：手动填写来源、原文、事实与判断，生成可复制、下载的 Markdown，没有模型自动提取或检索。
- `tools/meeting-memories/`：按日期保存和浏览影像、地点与备注，支持当前浏览器本地保存、JSON 备份与确认导入。公开版不读取旧版存储，不兼容旧版 ZIP。

## 维护与发布

沿用`qingmingyiyang/qingmingyiyang.github.io`的`main`分支与既有 GitHub Pages 设置。保留`projects`、`blog`、`tools`、`assets`及根目录文件的相对关系；整站 ZIP 的内容应直接位于网站根目录。

数字、职责和成果以本人确认的本地素材库为依据，网页只是派生展示。简历照片、电话、私人影像、候选人资料、原始题库和本地工作文件不属于公开仓库。

工具代码的 MIT 许可仅覆盖相应工具范围，文章和个人经历文字保留作者权利。已有 IBM Plex Mono 字体本地托管，来自 Google Fonts 官方仓库，以 SIL OFL 分发，许可见`assets/fonts/OFL-IBMPlexMono.txt`。
