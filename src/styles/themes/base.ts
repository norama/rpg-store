import defaultStyles from 'styles/themes/elements/defaultStyles'

const theme = {
  spaces: ['0px', '4px', '8px', '16px', '32px', '64px', '128px', '256px', '512px'],
  fonts: {
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    heading: 'inherit',
    monospace: 'Menlo, monospace',
  },
  fontSizes: ['12px', '14px', '16px', '20px', '24px', '32px', '48px', '64px', '96px'],
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125,
  },
  colors: {
    text: '#000',
    background: '#fff',
    primary: '#07c',
    secondary: '#30c',
    muted: '#f6f6f6',
  },
  styles: { ...defaultStyles },
}

export default theme
