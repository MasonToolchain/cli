import { program } from 'commander'
import { createProjectCommandConfig } from './commands/createProject.js'
import { genComponentCommandConfig } from './commands/createComponent.js'
import { genViewCommandConfig } from './commands/createView.js'
import { statisticsCommandConfig } from './commands/statistics.js'
import { installCommandConfig } from './commands/install.js'
import { uninstallCommandConfig } from './commands/uninstall.js'
import { createFileCommandConfig } from './commands/createFile.js'

// 初始化所有命令
const initializeCommands = () => {
  // 注册 create 命令组
  createProjectCommandConfig()

  // 注册 gen 命令组
  genComponentCommandConfig()
  genViewCommandConfig()

  // 注册 statistics 命令组
  statisticsCommandConfig()

  // 注册 install 命令组
  installCommandConfig()

  // 注册 uninstall 命令组
  uninstallCommandConfig()

  // 注册 create-file 命令组
  createFileCommandConfig()

  // 最后解析参数
  program.parse(process.argv)
}

initializeCommands()
