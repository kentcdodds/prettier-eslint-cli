import path from 'path'
import findUp from 'find-up'
import yargs from 'yargs'
import {oneLine} from 'common-tags'
import arrify from 'arrify'

const parser = yargs
  .usage('Usage: $0 <globs>... [--option-1 option-1-value --option-2]')
  .help('h')
  .alias('h', 'help')
  .version()
  .options({
    write: {
      default: false,
      describe: 'Edit the file in-place (beware!)',
      type: 'boolean',
    },
    stdin: {default: false, describe: 'Read input via stdin', type: 'boolean'},
    'eslint-ignore': {
      default: true,
      type: 'boolean',
      describe: oneLine`
        Only format matching files even if
        they are not ignored by .eslintignore.
        (can use --no-eslint-ignore to disable this)
      `,
    },
    eslintPath: {
      default: getPathInHostNodeModules('eslint'),
      describe: 'The path to the eslint module to use',
      coerce: coercePath,
    },
    prettierPath: {
      describe: 'The path to the prettier module to use',
      default: getPathInHostNodeModules('prettier'),
      coerce: coercePath,
    },
    ignore: {
      describe: oneLine`
          pattern(s) you wish to ignore
          (can be used multiple times
          and includes **/node_modules/** automatically)
        `,
      coerce: arrify,
    },
    'log-level': {
      describe: 'The log level to use',
      choices: ['silent', 'error', 'warn', 'info', 'debug', 'trace'],
      alias: 'l',
      default: 'warn',
    },
    // TODO: if we allow people to to specify a config path,
    // we need to read that somehow. These can come invarious
    // formats and we'd have to work out `extends` somehow as well.
    // I don't know whether ESLint exposes a way to do this...
    // Contributions welcome!
    // eslintConfigPath: {
    //   describe: 'Path to the eslint config to use for eslint --fix',
    // },
    // TODO: would this be just a JSON file? There's never going to be
    // a `.prettierrc`: https://github.com/jlongster/prettier/issues/154
    // so we'll have to be careful how we do this (if we do it at all).
    // prettierOptions: {
    //   describe: 'Path to the prettier config to use',
    // },,
  })
  .strict()

export default parser

function getPathInHostNodeModules(module) {
  const modulePath = findUp.sync(`node_modules/${module}`)
  if (modulePath) {
    return modulePath
  } else {
    return path.relative(__dirname, `../node_modules/${module}`)
  }
}

function coercePath(input) {
  return path.isAbsolute(input) ? input : path.join(process.cwd(), input)
}
