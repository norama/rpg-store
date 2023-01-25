import themeHolder from 'styles/theme'

// e.g. 'fontSize' -> 'fontSizes' in theme
const themeKey = (attr: string) => {
  switch (attr) {
    case 'fontFamily':
      return 'fonts'
    case 'background':
    case 'backgroundColor':
    case 'borderColor':
      return 'colors'
    case 'padding':
    case 'paddingLeft':
    case 'paddingRight':
    case 'paddingTop':
    case 'paddingBottom':
    case 'margin':
    case 'marginLeft':
    case 'marginRight':
    case 'marginTop':
    case 'marginBottom':
    case 'width':
    case 'height':
    case 'gap':
    case 'rowGap':
    case 'columnGap':
      return 'spaces'
    default:
      return attr + 's'
  }
}

const style = (tag = '', customStyle = {}) => {
  const theme = themeHolder.getTheme()
  if (!theme) {
    return { display: 'none' }
  }
  const themeStyle = theme.styles[tag] ?? {}
  const baseStyle = { ...themeStyle, ...customStyle }
  const derivedStyle = {}

  Object.keys(baseStyle).forEach((attr) => {
    const key = themeKey(attr)
    if (theme[key]) {
      derivedStyle[attr] = theme[key][baseStyle[attr]] ?? baseStyle[attr]
    }
  })

  //console.log(tag, { ...baseStyle, ...derivedStyle })

  return { ...baseStyle, ...derivedStyle }
}

export default style
