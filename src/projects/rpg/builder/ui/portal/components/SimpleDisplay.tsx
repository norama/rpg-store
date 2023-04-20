import ChipDisplay from '@builder/ui/widgets/ChipDisplay'
import Button from '@suid/material/Button'

type Props = {
  title?: string
}

const SimpleDisplay = ({ title = 'Body' }: Props) => {
  return (
    <div style={{ display: 'flex', 'margin-right': 'auto', height: '32px' }}>
      <div>{title}</div>
      <button onClick={() => alert('CLICKED')}>CLICK</button>
    </div>
  )
}

export default SimpleDisplay
