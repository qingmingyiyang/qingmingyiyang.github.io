# 熊帝权的个人主页

朴素的静态个人网站：暖白底色、深灰文字、少量绿色。无构建工具、无第三方字体或统计脚本，项目内容通过原生 details 展开，关闭 JavaScript 也可使用主页。

## 本地查看与修改

直接打开 `index.html`。正文在 `index.html` 中，配色和排版在 `style.css` 中。文件修改后刷新页面即可。

## 发布到 GitHub Pages

1. 登录自己的 GitHub，创建一个公开仓库。可以命名为 `personal-homepage`；如需账号根域名主页，则使用 `你的用户名.github.io`。已有同名仓库时先检查内容，避免覆盖原网站。
2. 把本目录内的文件和子目录按原结构上传到仓库根目录并提交，包含 `blog`、`tools` 和 `context-card-source.zip`。不要把整站 ZIP 本身或外面的整个文件夹当作首页上传。
3. 打开仓库 **Settings → Pages**，Source 选择 **Deploy from a branch**，分支选择 **main**，目录选择 **/ (root)**，保存。
4. 等待 Pages 部署完成，使用页面显示的地址访问。普通仓库的网址为 `https://你的用户名.github.io/personal-homepage/`；用户名主页仓库的网址为 `https://你的用户名.github.io/`。

后续修改上述文件并提交即可更新网站。发布设置参考 [GitHub 官方文档](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

网站包含职业简介、3篇实践文章和上下文卡片小工具。工具代码的 MIT 许可仅覆盖工具范围，文章和个人经历文字保留作者权利。博客 HTML 是展示版，同名 Markdown 便于再编辑；修改时请同步两个版本。

网站仅包含公开职业简介和个人项目概述。详细履历库、电话、私人资料、题库、业务数据和本地工作文件不属于此仓库内容。

## 线上入口

主页：https://qingmingyiyang.github.io/
仓库：https://github.com/qingmingyiyang/qingmingyiyang.github.io

