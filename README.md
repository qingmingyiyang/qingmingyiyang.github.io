# 熊帝权的个人主页

[公开主页](https://qingmingyiyang.github.io/) · [源码仓库](https://github.com/qingmingyiyang/qingmingyiyang.github.io)

全站为书封长卷风格。首页依次是书封、“我能解决的三类问题”、目录和四章：壹调研长卷、贰战略分析、叁HR经验、肆AI应用，最后是结尾。2026-10-24起全站白底，用千里江山图四色（赭石、石青、石绿、青碧）：首页每章一色，往下滑颜色由深到浅；其他页面页顶淡淡一层青碧，完整经历的研究两节用石青、两段HR实习用石绿。朱砂只留给封面点缀和印章。完整经历、文章和各作品页与首页同一套宋体，页头为题字“熊帝权”和同一组导航。历史项目与文章保持原URL。

设计规范见[DESIGN.md](DESIGN.md)。全站固定浅色。

页面基于静态HTML/CSS/JavaScript，不需要构建：

- 首页 index.html 的样式内联在页面里；
- 其他页面共用 book.css；
- portfolio.js 负责作品页截图画廊切换，showcase.js 负责考核题卡角色演示、截图放大和见见面内嵌日历；
- 正文字体是思源宋体的子集（assets/book/fonts）。首页只加载首页用到的字；其他页面多出的字放在扩展包里，按 book.css 中的 unicode-range 加载。任何页面改了文字，都要先运行 work/PORTFOLIO-BOOK-20261023/claude/subset-site-fonts.py 重切字体再发布，否则新加的字会显示成别的字体。

tools/ 下的上下文卡片和见见面是独立小工具，仍用原来的 style.css、portfolio.css、site-theme.css 与 site-dark.css。

本地预览可在此目录运行python -m http.server 8788 --bind 127.0.0.1，打开http://127.0.0.1:8788/。公开目录只包含网站资源，不包含私人简历、联系方式表、完整报告或内部协作记录。
