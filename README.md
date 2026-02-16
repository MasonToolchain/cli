# Mason CLI

Mason CLI 是一个用于初始化项目、生成 Vue 文件、以及辅助管理依赖的命令行工具。

当前包信息：
- 包名：`@noahlife/mason-cli`
- 可执行命令：`mason-cli`
- 入口：`bin/init.js`

## 安装

```bash
pnpm add -g @noahlife/mason-cli
# 或
npm i -g @noahlife/mason-cli
```

本地开发调试：

```bash
pnpm install
pnpm run build
npm link
mason-cli --help
```

## 快速开始

```bash
# 方式 1：全局安装后使用
mason-cli create my-app

# 方式 2：每次都使用最新版本（推荐）
npx @noahlife/mason-cli@latest create my-app

# 如果你希望保持 create@latest 的调用风格
mason-cli create@latest my-app
# 或
npx @noahlife/mason-cli@latest create@latest my-app
```

## 命令说明

以下命令都以 `mason-cli` 为前缀。

### create / create@latest

初始化一个新项目，并从模板仓库拉取代码。

```bash
mason-cli create [projectName]
mason-cli create@latest [projectName]
```

参数：
- `-t, --template <template>`：指定模板名称。
- `-o, --overwrite`：目标目录已存在时先删除再创建。
- `--list-templates`：查看所有可用模板。

当前内置模板：
- `vue3-ts`：`github:MasonToolchain/vue3-ts-template#master`

示例：

```bash
# 交互输入项目名和模板
mason-cli create

# 指定项目名
mason-cli create my-app

# 指定模板
mason-cli create my-app -t vue3-ts

# 列出模板
mason-cli create --list-templates

# 覆盖已有目录
mason-cli create my-app -o
```

### gen

在 `src/components` 中生成 Vue 组件。

```bash
mason-cli gen <filename>
```

参数：
- `-d, --dirname <dirname>`：生成到 `src/components/<dirname>/`。
- `-o, --overwrite`：目标文件已存在时覆盖。

### gen-view

在 `src/views` 中生成视图文件，并向 `src/router/index.js` 注入路由与 import。

```bash
mason-cli gen-view <filename> -r <routerPath>
```

参数：
- `-r, --router-path <routerPath>`：路由路径（必填）。
- `-d, --dirname <dirname>`：生成到 `src/views/<dirname>/`。
- `-o, --overwrite`：目标文件已存在时覆盖。

### create-file

交互式创建文件。

```bash
mason-cli create-file
```

### install

交互式安装依赖。

```bash
mason-cli install
```

### uninstall

交互式卸载依赖。

```bash
mason-cli uninstall
```

### statistics

统计当前目录下的文件字符数与估算行数。

```bash
mason-cli statistics
```

## 模板扩展

`create` 命令已支持模板注册表模式，后续新增模板只需要在 `src/commands/createProject.js` 的 `TEMPLATE_REGISTRY` 中增加一项：

```js
{
  name: 'template-key',
  displayName: 'Template Display Name',
  repo: 'github:owner/repo#branch',
  description: 'Template description.'
}
```

新增后，CLI 会自动支持：
- `--list-templates` 展示新模板。
- `--template <template-key>` 指定新模板。
- 交互式模板选择。

## 开发与构建

```bash
pnpm run build
```

## 目录结构

```text
bin/            CLI 入口
src/            源码
  commands/     各命令实现
  templates/    EJS 模板
  utils/        工具函数
dist/           打包产物
```
