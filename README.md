
# gatsby-plugin-html2amp

Create AMP(Accelerated Mobile Pages) for your Gatsby site by using [html2amp](https://github.com/tomoyukikashiro/html2amp)

## Install

```bash
$ npm install --save gatsby-plugin-html2amp
```

## How to use

In gatsby-config.js
```js
{
  resolve: 'gatsby-plugin-html2amp',
  options: {
    files: ['post/**/index.html', 'index.html'],
    publicPath: 'public',
    gaConfigPath: 'gaConfig.json',
    dist: 'public/dist'
  }
}
```

## Options

- files
  - List of generated html path patterns from `publicPath`
  - Default is `[**/*.html]`
- publicPath
  - Directory for building by gatsby
  - Default is `public`
- gaConfigPath
  - amp-analytics config json for [google analytics](https://www.ampproject.org/docs/analytics/analytics-vendors)
  - The path is from `publicPath`
  - Optional
- dist
  - Path to output
  - If the options is not set files are override by AMP result

## More Detail

Please check my article out for detail. ⚡

https://blog.tomoyukikashiro.me/post/amp-using-gatsby
