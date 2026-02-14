# Mason CLI

Mason CLI 是一个用于创建 Mason 项目、生成 Vue 组件/视图、以及提供部分项目辅助能力的命令行工具。

本 README 以当前仓库 `cli/` 目录下的实现为准。

## 安装

该包已在 `package.json` 中声明了 bin：

- 命令名：`mason-cli`
- 入口：`cli/bin/init.js`

本地开发/调试常见方式：

```bash
# 在 cli 目录内
pnpm install
pnpm run build

# 方式 1：使用 npm link 将 mason-cli 链接到全局
npm link

# 之后即可在任意目录使用
mason-cli --help
```

如果你是从 npm 安装（发布包名为 `@noahlife/mason-cli`），则可以：

```bash
npm i -g @noahlife/mason-cli
# 或
pnpm add -g @noahlife/mason-cli

mason-cli --help
```

## 快速开始

```bash
# 查看帮助
mason-cli --help

# 创建项目
mason-cli create my-project

# 进入项目并安装依赖（创建命令会在终端提示后续操作）
cd my-project
pnpm install
pnpm run dev
```

## 命令

下面所有命令均以 `mason-cli` 作为前缀。

### create

创建一个新项目到当前工作目录下。

```bash
mason-cli create <projectName>
```

参数：

- `-o, --overwrite`：当目标目录已存在时，先删除后重新创建。

说明：

- 项目模板通过 `download-git-repo` 拉取，当前实现固定为 `github:ZRMYDYCG/Mason#main`。

示例：

```bash
# 创建项目
mason-cli create my-project

# 覆盖同名目录
mason-cli create my-project -o
```

### gen

在当前项目内生成一个 Vue 组件文件，默认生成到 `src/components`。

```bash
mason-cli gen <filename>
```

参数：

- `-d, --dirname <dirname>`：生成到 `src/components/<dirname>/`。
- `-o, --overwrite`：当目标文件已存在时覆盖。

说明：

- 组件文件名会被转换为首字母大写形式（例如 `button` -> `Button.vue`）。

示例：

```bash
# 生成 src/components/Button.vue
mason-cli gen button

# 生成 src/components/form/Input.vue
mason-cli gen input -d form

# 覆盖已存在文件
mason-cli gen button -o
```

### gen-view

生成一个视图组件到 `src/views`，并自动向 `src/router/index.js` 注入路由与 import。

```bash
mason-cli gen-view <filename> -r <routerPath>
```

参数：

- `-r, --router-path <routerPath>`：路由路径（必填）。
- `-d, --dirname <dirname>`：生成到 `src/views/<dirname>/`。
- `-o, --overwrite`：当目标文件已存在时覆盖。

重要说明（与当前实现保持一致）：

- 视图文件名会被转换为首字母大写形式（例如 `home` -> `Home.vue`）。
- 命令会直接修改 `src/router/index.js`，并假设其中存在名为 `routes` 的数组变量用于追加路由。

示例：

```bash
# 生成 src/views/Home.vue，并写入路由 path 为 /home
mason-cli gen-view home -r /home

# 生成到子目录，并覆盖已存在文件
mason-cli gen-view profile -d user -r /user/profile -o
```

### create-file

交互式创建一个新文件。

```bash
mason-cli create-file
```

交互项：

- 文件类型：`js` / `ts` / `html` / `css` / `scss` / `less`
- 文件夹名称：
  - 默认创建在 `./src/` 下
  - 如果以 `../` 开头，则会创建在项目根目录的相对路径（例如输入 `../utils` 会创建到 `./utils`）
- 文件名称

说明：

- 当目标文件夹存在时，会再次询问是否继续在该文件夹创建。

### install

交互式安装依赖。

```bash
mason-cli install
```

交互项：

- 输入要安装的包名（多个包可用空格分隔）
- 选择安装工具：`cnpm` / `npm` / `pnpm` / `yarn`
- 选择安装类型：生产依赖（`-S`）或开发依赖（`-D`）

### uninstall

交互式卸载依赖（当前实现固定使用 `pnpm uninstall`）。

```bash
mason-cli uninstall
```

### statistics

统计当前目录（通常为项目根目录）下的文件字符数与估算行数。

```bash
mason-cli statistics
```

说明：

- 会跳过部分目录/文件：`.git`、`node_modules`、`.vscode`、`package.json` 等（详见实现中的 `excludesFiles`）。

## CLI 目录结构

```text
cli/
  bin/            命令行入口
  src/            源码
    commands/     各命令实现
    templates/    ejs 模板
    utils/        工具函数
  dist/           打包产物（rollup build）
  package.json    包配置（bin、依赖等）
```
