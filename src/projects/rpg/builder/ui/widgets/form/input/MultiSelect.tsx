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

const LEFT_ARROW = '\u003c'
const RIGHT_ARROW = '\u003e'

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1)
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1)
}

const CustomList = ({ items, checked, onToggle }) => (
  <Paper sx={{ width: 200, height: 180, overflow: 'auto' }}>
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
                color="success"
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
    <div>
      <div style={{ 'text-align': 'center', color: 'green' }}>
        <h1>GeeksforGeeks</h1>
        <h2>React MUI Transfer List Input</h2>
      </div>
      <div style={{ 'text-align': 'center' }}>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item>
            <CustomList items={left} checked={checked} onToggle={handleToggle} />
          </Grid>
          <Grid item>
            <Grid container direction="column" alignItems="center">
              <Button
                sx={{ my: 0.5 }}
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
                sx={{ my: 0.5 }}
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
                sx={{ my: 0.5 }}
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
                sx={{ my: 0.5 }}
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
    </div>
  )
}

export default MultiSelect
