import defaultStyles from 'styles/themes/elements/defaultStyles'

const theme = {
  spaces: ['0px', '4px', '8px', '16px', '32px', '64px', '128px', '256px', '512px'],
  fonts: {
    body: 'Roboto, system-ui, sans-serif',
    heading: 'Roboto, system-ui, sans-serif',
    monospace: '"Roboto Mono", monospace',
  },
  fontSizes: ['1rem', '1.5rem', '2rem', '2.5rem', '3rem', '3.5rem', '4rem', '4.55rem', '5rem'],
  //fontSizes: ['12px', '14px', '16px', '20px', '24px', '32px', '48px', '64px', '96px'],
  fontWeights: {
    body: 400,
    heading: 600,
    bold: 600,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125,
  },
  colors: {
    ...defaultStyles.colors,
    sharp: 'black',
    card: '#2f3136',
    errorbg: '#d4d0c7',
    text: '#202124',
    background: '#debe6f',
    background2: '#f6e7c0',
    primary: '#1a73e8',
    secondary: '#9c27b0',
    muted: '#f1f3f4',
    highlight: '#6244db',
    link: '#0a6ba3',
    linkButton: '#1976d2',
  },
  styles: { ...defaultStyles },
}

export default theme
