# 熊帝权的个人主页

[公开主页](https://qingmingyiyang.github.io/) · [源码仓库](https://github.com/qingmingyiyang/qingmingyiyang.github.io)

首页依次呈现AI与HR流程实践、硕士阶段区域公用品牌研究，以及个人工具、校园和创作经历。腾讯案例展开招聘交付、个人使用的工作台原型及销培生考核，研究案例保留现场判断和交付依据。历史项目与文章保持原URL。

设计规范见[DESIGN.md](DESIGN.md)。首页复用暖纸色、衬线标题、CSS连接Logo与可点击经历关系图；全站跟随系统深浅主题，持续动画支持暂停和减少动态效果。

页面基于静态HTML/CSS/JavaScript，不需要构建。首页样式为portfolio.css与home-editorial.css；其他个人页面复用site-theme.css和site-dark.css。portfolio.js维护导航与项目交互，map-motion.js仅增强关系导览。

本地预览可在此目录运行python -m http.server 8788 --bind 127.0.0.1，打开http://127.0.0.1:8788/。公开目录只包含网站资源，不包含私人简历、联系方式表、完整报告或内部协作记录。
