import path from 'path'
import fs from 'fs-extra'
import colors from 'picocolors'
import downloadGitRepo from 'download-git-repo'
import ora from 'ora'
import prompts from 'prompts'
import { program } from 'commander'

const { blue, cyan, green, red, yellow } = colors
const cwd = process.cwd()
const spinner = ora()

const TEMPLATE_REGISTRY = [
  {
    name: 'vue3-ts',
    displayName: 'Vue 3 + TypeScript',
    repo: 'github:MasonToolchain/vue3-ts-template#master',
    description: 'Vue 3 starter template with TypeScript.'
  }
]

const INVALID_PROJECT_NAME = /[<>:"/\\|?*\u0000-\u001f]/

const getTemplateByName = (templateName) => {
  return TEMPLATE_REGISTRY.find((item) => item.name === templateName)
}

const listTemplates = () => {
  console.log(cyan('Available templates:'))
  for (const template of TEMPLATE_REGISTRY) {
    console.log(`- ${template.name}: ${template.displayName}`)
    console.log(`  ${template.description}`)
    console.log(`  Source: ${template.repo}`)
  }
}

const askProjectNameIfNeeded = async (projectName) => {
  if (typeof projectName === 'string' && projectName.trim()) {
    return projectName.trim()
  }

  const response = await prompts({
    type: 'text',
    name: 'projectName',
    message: 'Project name:',
    validate: (value) => {
      const normalized = String(value || '').trim()
      if (!normalized) return 'Project name is required.'
      if (INVALID_PROJECT_NAME.test(normalized)) {
        return 'Project name contains invalid path characters.'
      }
      return true
    }
  })

  return response.projectName?.trim()
}

const askTemplateIfNeeded = async (templateName) => {
  if (templateName) {
    const template = getTemplateByName(templateName)
    if (!template) {
      throw new Error(
        `Unknown template "${templateName}". Run "mason-cli create --list-templates" first.`
      )
    }
    return template
  }

  const response = await prompts({
    type: 'select',
    name: 'templateName',
    message: 'Select a project template',
    choices: TEMPLATE_REGISTRY.map((template) => ({
      title: `${template.name} (${template.displayName})`,
      description: template.description,
      value: template.name
    }))
  })

  return getTemplateByName(response.templateName)
}

const createTargetDirectory = (projectName, overwrite) => {
  const projectPath = path.resolve(cwd, projectName)

  if (fs.existsSync(projectPath)) {
    if (!overwrite) {
      throw new Error(
        `Directory "${projectName}" already exists. Use --overwrite to recreate it.`
      )
    }

    fs.removeSync(projectPath)
  }

  fs.mkdirpSync(projectPath)
  return projectPath
}

const downloadTemplate = (repo, destinationPath) => {
  return new Promise((resolve, reject) => {
    downloadGitRepo(repo, destinationPath, (error) => {
      if (error) {
        reject(error)
        return
      }
      resolve()
    })
  })
}

const printNextSteps = (projectName, templateName) => {
  console.log(green(`\nProject "${projectName}" created successfully.`))
  console.log(blue(`Template: ${templateName}`))
  console.log(green(`cd ${projectName}`))
  console.log(green('pnpm install'))
  console.log(green('pnpm run dev'))
}

const createProjectCommand = async (projectNameArg, options) => {
  let projectPath = ''
  let projectName = ''

  try {
    if (options.listTemplates) {
      listTemplates()
      return
    }

    projectName = await askProjectNameIfNeeded(projectNameArg)
    if (!projectName) {
      console.log(yellow('Create command cancelled.'))
      return
    }

    const template = await askTemplateIfNeeded(options.template)
    if (!template) {
      console.log(yellow('Template selection cancelled.'))
      return
    }

    projectPath = createTargetDirectory(projectName, options.overwrite)
    spinner.text = `Downloading template "${template.name}"...`
    spinner.start()

    await downloadTemplate(template.repo, projectPath)

    spinner.succeed('Project files downloaded.')
    printNextSteps(projectName, template.name)
  } catch (error) {
    spinner.stop()
    if (projectPath && fs.existsSync(projectPath)) {
      fs.removeSync(projectPath)
    }
    console.log(red(`Create project failed: ${error.message || error}`))
    process.exit(1)
  }
}

const registerCreateCommand = (commandName, description) => {
  program
    .command(commandName)
    .description(description)
    .option(
      '-t, --template <template>',
      'Template name. Use --list-templates to inspect all templates.'
    )
    .option('-o, --overwrite', 'Overwrite target directory if it already exists.')
    .option('--list-templates', 'Print available templates and exit.')
    .action(createProjectCommand)
}

export const createProjectCommandConfig = () => {
  registerCreateCommand('create [projectName]', 'Create a new project from starter templates')
  registerCreateCommand(
    'create@latest [projectName]',
    'Alias of "create" to match create@latest style usage'
  )
}
