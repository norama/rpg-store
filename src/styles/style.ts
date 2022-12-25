import getTheme from 'styles/theme'

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
    case 'margin':
    case 'width':
    case 'height':
      return 'spaces'
    default:
      return attr + 's'
  }
}

const style = (tag = '', customStyle = {}) => {
  const theme = getTheme()
  const themeStyle = theme.styles[tag] ?? {}
  const baseStyle = { ...themeStyle, ...customStyle }
  const derivedStyle = {}

  Object.keys(baseStyle).forEach((attr) => {
    const key = themeKey(attr)
    if (theme[key]) {
      derivedStyle[attr] = theme[key][baseStyle[attr]] ?? baseStyle[attr]
    }
  })

  return { ...baseStyle, ...derivedStyle }
}

export default style
