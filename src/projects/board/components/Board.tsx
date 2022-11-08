import { useStore } from '@nanostores/solid'
import gridSideLengthAtom from 'projects/board/stores/gridSideLength'
import { createMemo, Index } from 'solid-js'

import './board.css'

const maxGridPixelWidth = 500

function randomHexColorString(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

const Board = () => {
  const gridSideLength = useStore(gridSideLengthAtom)
  const gridTemplateString = createMemo(
    () => `repeat(${gridSideLength()}, ${maxGridPixelWidth / gridSideLength()}px)`
  )

  return (
    <div
      style={{
        'margin-top': '1rem',
        'background-color': 'beige',
        width: 'fit-content',
        display: 'grid',
        'grid-template-rows': gridTemplateString(),
        'grid-template-columns': gridTemplateString(),
      }}
    >
      <Index
        each={Array.from({ length: gridSideLength() ** 2 })}
        fallback={'Input a grid side length.'}
      >
        {() => (
          <div
            class="cell"
            onMouseEnter={(event) => {
              const eventEl = event.currentTarget

              eventEl.style.backgroundColor = randomHexColorString()

              setTimeout(() => {
                eventEl.style.backgroundColor = 'initial'
              }, 500)
            }}
          ></div>
        )}
      </Index>
    </div>
  )
}

export default Board
