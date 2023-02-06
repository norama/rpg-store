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
} from '@suid/material'
import { createSignal, createEffect } from 'solid-js'
import style from 'styles/style'

const LEFT_ARROW = '\u003c'
const RIGHT_ARROW = '\u003e'

const LIST_STYLE = { my: 0.5, fontWeight: 700 } //style('list', { my: 0.5, fontWeight: 700 })

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1)
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1)
}

const CustomList = ({
  items,
  checked,
  onToggle,
  customStyle = { width: '200px', height: '300px' },
}) => (
  <Paper sx={customStyle}>
    <List dense component="div" role="list">
      {items().map((value) => {
        const labelId = `transfer-list-item-${value}-label`

        return (
          <ListItem role="listitem" onClick={() => onToggle(value)}>
            <ListItemIcon>
              <Checkbox
                checked={checked().indexOf(value) !== -1}
                tabIndex={-1}
                disableRipple
                sx={{ transform: 'scale(1.2)' }}
                color="success"
                size="medium"
                inputProps={{
                  'aria-labelledby': labelId,
                }}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={`Item ${value + 1}`} />
          </ListItem>
        )
      })}
      <ListItem />
    </List>
  </Paper>
)

const MultiSelect = () => {
  const [checked, setChecked] = createSignal([])
  const [left, setLeft] = createSignal([0, 1, 2])
  const [right, setRight] = createSignal([3, 4, 5])

  const [leftChecked, setLeftChecked] = createSignal([])
  const [rightChecked, setRightChecked] = createSignal([])

  createEffect(() => {
    setLeftChecked(intersection(checked(), left()))
    setRightChecked(intersection(checked(), right()))
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
    setRight([...right(), ...left()])
    setLeft([])
  }

  const handleCheckedRight = () => {
    setRight([...right(), ...leftChecked()])
    setLeft(not(left(), leftChecked()))
    setChecked(not(checked(), leftChecked()))
  }

  const handleCheckedLeft = () => {
    setLeft([...left(), ...rightChecked()])
    setRight(not(right(), rightChecked()))
    setChecked(not(checked(), rightChecked()))
  }

  const handleAllLeft = () => {
    setLeft([...left(), ...right()])
    setRight([])
  }

  return (
    <div style={{ 'text-align': 'center' }}>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item>
          <CustomList items={left} checked={checked} onToggle={handleToggle} />
        </Grid>
        <Grid item>
          <Grid container direction="column" alignItems="center">
            <Button
              sx={LIST_STYLE}
              variant="contained"
              color="success"
              size="medium"
              onClick={handleAllRight}
              disabled={left().length === 0}
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
              disabled={leftChecked().length === 0}
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
              disabled={rightChecked().length === 0}
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
              disabled={right().length === 0}
              aria-label="move all left"
            >
              ≪
            </Button>
          </Grid>
        </Grid>
        <Grid item>
          <CustomList items={right} checked={checked} onToggle={handleToggle} />
        </Grid>
      </Grid>
    </div>
  )
}

export default MultiSelect
