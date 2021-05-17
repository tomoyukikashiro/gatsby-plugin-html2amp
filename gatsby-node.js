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
    vendor: 'googleanalytics',
    dist: null,
    serviceWorker: null,
    optimize: false,
    htmlPlugins: [],
    cssPlugins: []
  }
  const { files, publicPath, gaConfigPath, vendor, dist, serviceWorker, optimize, htmlPlugins, cssPlugins } = {
    ...defaultOptions,
    ...pluginOptions
  }
  const absolutePaths = files.map(file =>
    slash(path.join(process.cwd(), publicPath, file))
  )
  const htmls = globby.sync(absolutePaths)
  const config = {
    gaConfigPath,
    vendor,
    cwd: slash(path.join(process.cwd(), publicPath)),
    serviceWorker,
    optimize,
    htmlPlugins,
    cssPlugins
  }
  const promises = htmls.map(async html => {
    const buffer = fs.readFileSync(html)
    const amp = await html2amp(buffer.toString(), config)
    if (dist) {
      const basePath = slash(path.join(process.cwd(), publicPath))
      const ampPath = slash(path.join(process.cwd(), dist))
      const newFilePath = html.replace(basePath, ampPath)
      fs.outputFileSync(newFilePath, amp)
    } else {
      fs.writeFileSync(html, amp)
    }
  })
  return Promise.all(promises)
}
