import defaultStyles from 'styles/themes/elements/defaultStyles'

const theme = {
  spaces: ['0px', '4px', '8px', '16px', '32px', '64px', '128px', '256px', '512px'],
  colors: {
    ...defaultStyles.colors,
    sharp: 'white',
    card: '#ebdcb9',
    errorbg: 'white',
    text: '#debe6f',
    background: '#202124',
    background2: '#2d2d2f',
    primary: '#3cf',
    secondary: '#e0f',
    muted: '#4a4a4a',
    highlight: '#e0f',
    gray: '#999',
    purple: '#c0f',
    link: '#65b0db',
    linkButton: 'darkblue',
  },
  fonts: {
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    heading: 'inherit',
    monospace: 'Menlo, monospace',
  },
  fontSizes: ['1rem', '1.5rem', '2rem', '2.5rem', '3rem', '3.5rem', '4rem', '4.55rem', '5rem'],
  //fontSizes: ['12px', '14px', '16px', '20px', '24px', '32px', '48px', '64px', '72px'],
  fontWeights: {
    body: 400,
    heading: 700,
    display: 900,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.25,
  },
  text: {
    heading: {
      fontFamily: 'heading',
      fontWeight: 'heading',
      lineHeight: 'heading',
    },
    display: {
      variant: 'text.heading',
      fontSize: [5, 6],
      fontWeight: 'display',
      letterSpacing: '-0.03em',
      mt: 3,
    },
  },
  styles: { ...defaultStyles },
  prism: {
    '.comment,.prolog,.doctype,.cdata,.punctuation,.operator,.entity,.url': {
      color: 'gray',
    },
    '.comment': {
      fontStyle: 'italic',
    },
    '.property,.tag,.boolean,.number,.constant,.symbol,.deleted,.function,.class-name,.regex,.important,.variable':
      {
        color: 'purple',
      },
    '.atrule,.attr-value,.keyword': {
      color: 'primary',
    },
    '.selector,.attr-name,.string,.char,.builtin,.inserted': {
      color: 'secondary',
    },
  },
}

export default theme
