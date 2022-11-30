type Props = {
  name: string
}

const StringInput = ({ name }: Props) => {
  return (
    <p
      style={{
        color: import.meta.env.SSR ? 'red' : 'green',
        'font-weight': 700,
        'font-size': '1.5rem',
      }}
    >
      {name}:{' '}
      <input type="text" id="name" name="name" required minlength="4" maxlength="8" size="10" />
    </p>
  )
}

export default StringInput
