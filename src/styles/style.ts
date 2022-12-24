import theme from 'styles/theme'

// e.g. 'fontSize' -> 'fontSizes' in theme
const themeKey = (attr: string) => {
  switch (attr) {
    case 'fontFamily':
      return 'fonts'
    case 'background':
    case 'backgroundColor':
      return 'colors'
    case 'padding':
    case 'margin':
      return 'spaces'
    default:
      return attr + 's'
  }
}

const style = (tag: string) => {
  const baseStyle = theme.styles[tag]
  const derivedStyle = {}

  Object.keys(baseStyle).forEach((attr) => {
    const key = themeKey(attr)
    if (theme[key]) {
      derivedStyle[attr] = theme[key][baseStyle[attr]]
    }
  })

  return { ...baseStyle, ...derivedStyle }
}

export default style
