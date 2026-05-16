# PRD / README 使用 git-crypt 解密的说明(研发)

本仓库在 Git 里对 `PRD/**/*.md` 与根目录 `README.md` 使用 `git-crypt` 加密. 线上看到的是密文, **本地工作区在解锁后应为可读 Markdown**.

## 你需要准备

- 已安装 Homebrew 的 macOS(或已自行安装 `git-crypt` 的环境).
- 维护者单独发你的 **密钥文件**(例如 `bestads-git-crypt.key`), **不要**把密钥提交进 Git, 也不要粘到 issue/公开聊天.

## 最短操作(复制粘贴改路径即可)

1. 安装: `brew install git-crypt`
2. 克隆: `git clone https://github.com/TK0918/BestAds.git && cd BestAds`
3. 解锁(把路径换成你保存的密钥实际位置): `git-crypt unlock ~/Desktop/bestads-git-crypt.key`
4. 自检: 用编辑器打开 `README.md` 或任意 `PRD/*.md`, 应是正常中文/英文 Markdown, 而不是以 `GITCRYPT` 开头的二进制.
5. 若拉取新提交后又变乱码: 在本仓库根目录重新执行第 3 步, 或确认本机 `git-crypt` 仍可用.

## 常见问题

- **只想在网页上下载单个 Raw `.md`**: 下载到的是密文, **请整仓 clone 再 `unlock`**, 不要指望单文件「另存为」自动变明文.
- **历史安全**: 较早的 commit 里可能仍存在明文 PRD. 若曾公开过敏感版本, 需另外做历史清理或信息轮换, 加密只保护「当前及之后」的提交形态.

## 仍无法解密时提供给维护者的信息

- `git-crypt --version`
- `cd` 到仓库根目录后执行 `pwd`
- `git-crypt unlock` 的完整报错原文(可打马赛克路径中的用户名).
