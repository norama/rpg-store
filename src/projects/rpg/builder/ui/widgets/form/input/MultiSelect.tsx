// Reference: https://www.geeksforgeeks.org/react-mui-transfer-list-input/

import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Button,
  Paper,
  Typography,
} from '@suid/material'
import { createSignal, createEffect } from 'solid-js'
import style from 'styles/style'

const LEFT_ARROW = '\u003c'
const RIGHT_ARROW = '\u003e'

const LIST_STYLE = style('list', { my: 0.5, fontWeight: 700 })

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1)
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1)
}

type ListProps = {
  label?: string
  items: () => string[]
  texts: (option: string) => string
  checked: () => string[]
  onToggle: (value: string) => void
  customStyle?: object
  disabled?: boolean
}

const CustomList = ({
  label,
  items,
  texts,
  checked,
  onToggle,
  customStyle = { width: '300px', height: '400px' } as object,
  disabled,
}: ListProps) => (
  <>
    {' '}
    {label && <Typography variant="button">{label}</Typography>}
    <Paper sx={style('list', customStyle)}>
      <List dense component="div" role="list">
        {items().map((value) => {
          const labelId = `transfer-list-item-${value}-label`

          return (
            <ListItem role="listitem" onClick={() => onToggle(value)}>
              <ListItemIcon>
                <Checkbox
                  disabled={disabled}
                  checked={checked().indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  sx={style('checkbox', { transform: 'scale(1.2)' })}
                  color="success"
                  size="medium"
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={texts(value)}
                sx={{ opacity: disabled ? 0.8 : 1 }}
              />
            </ListItem>
          )
        })}
        <ListItem />
      </List>
    </Paper>
  </>
)

type Props = {
  disabled?: boolean
  label?: string
  options: () => string[]
  texts?: (option: string) => string
  values: () => string[]
  onChange: (values: string[]) => void
  customStyle?: object
}

const MultiSelect = ({
  disabled,
  label,
  options,
  texts = (option) => option,
  values,
  onChange,
  customStyle,
}: Props) => {
  const [checked, setChecked] = createSignal([])
  const [left, setLeft] = createSignal(not(options(), values()))
  const [right] = createSignal(values())

  const [leftChecked, setLeftChecked] = createSignal([])
  const [rightChecked, onChangeChecked] = createSignal([])

  createEffect(() => {
    setLeftChecked(intersection(checked(), left()))
    onChangeChecked(intersection(checked(), right()))
  })

  const handleToggle = (value) => {
    const currentIndex = checked().indexOf(value)
    const newChecked = [...checked()]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  const handleAllRight = () => {
    onChange([...right(), ...left()])
    setLeft([])
  }

  const handleCheckedRight = () => {
    onChange([...right(), ...leftChecked()])
    setLeft(not(left(), leftChecked()))
    setChecked(not(checked(), leftChecked()))
  }

  const handleCheckedLeft = () => {
    setLeft([...left(), ...rightChecked()])
    onChange(not(right(), rightChecked()))
    setChecked(not(checked(), rightChecked()))
  }

  const handleAllLeft = () => {
    setLeft([...left(), ...right()])
    onChange([])
  }

  return (
    <div>
      {label && <Typography variant="h6">{label}</Typography>}
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        style={{ 'text-align': 'center', 'margin-top': '10px' }}
      >
        <Grid item>
          <CustomList
            label="Na výběr"
            items={left}
            texts={texts}
            checked={checked}
            onToggle={handleToggle}
            customStyle={customStyle}
            disabled={disabled}
          />
        </Grid>
        <Grid item>
          <Grid container direction="column" alignItems="center">
            <Button
              sx={LIST_STYLE}
              variant="contained"
              color="success"
              size="medium"
              onClick={handleAllRight}
              disabled={!!disabled || left().length === 0}
              aria-label="move all right"
            >
              ≫
            </Button>
            <Button
              sx={LIST_STYLE}
              variant="outlined"
              color="success"
              size="medium"
              onClick={handleCheckedRight}
              disabled={!!disabled || leftChecked().length === 0}
              aria-label="move selected right"
            >
              {RIGHT_ARROW}
            </Button>
            <Button
              sx={LIST_STYLE}
              variant="outlined"
              color="success"
              size="medium"
              onClick={handleCheckedLeft}
              disabled={!!disabled || rightChecked().length === 0}
              aria-label="move selected left"
            >
              {LEFT_ARROW}
            </Button>
            <Button
              sx={LIST_STYLE}
              variant="contained"
              color="success"
              size="medium"
              onClick={handleAllLeft}
              disabled={!!disabled || right().length === 0}
              aria-label="move all left"
            >
              ≪
            </Button>
          </Grid>
        </Grid>
        <Grid item>
          <CustomList
            label="Vybrané"
            items={right}
            texts={texts}
            checked={checked}
            onToggle={handleToggle}
            customStyle={customStyle}
            disabled={disabled}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default MultiSelect
