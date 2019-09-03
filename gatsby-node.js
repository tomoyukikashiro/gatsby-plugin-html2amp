const path = require('path')
const slash = require('slash')
const fs = require('fs-extra')
const globby = require('globby')
const html2amp = require('html2amp')

exports.onPostBuild = (_, pluginOptions) => {
  const defaultOptions = {
    files: ['**/*.html'],
    publicPath: 'public',
    gaConfigPath: null,
    dist: null,
    serviceWorker: null
  }
  const { files, publicPath, gaConfigPath, dist, serviceWorker } = {
    ...defaultOptions,
    ...pluginOptions
  }
  const absolutePaths = files.map(file =>
    path.join(process.cwd(), publicPath, file)
  )
  const htmls = globby.sync(absolutePaths)
  const config = {
    gaConfigPath,
    cwd: path.join(process.cwd(), publicPath),
    serviceWorker
  }
  const promises = htmls.map(async html => {
    const buffer = fs.readFileSync(html)
    const winPlatform = process.platform === 'win32' // check win32 platform
    const amp = await html2amp(buffer.toString(), config)
    if (dist) {
      const basePath = winPlatform
        ? slash(path.join(process.cwd(), publicPath)) // if win32 replace slash
        : path.join(process.cwd(), publicPath)
      const ampPath = winPlatform
        ? slash(path.join(process.cwd(), dist)) // if win32 replace slash
        : path.join(process.cwd(), dist)
      const newFilePath = html.replace(basePath, ampPath)
      fs.outputFileSync(newFilePath, amp)
    } else {
      fs.writeFileSync(html, amp)
    }
  })
  return Promise.all(promises)
}
