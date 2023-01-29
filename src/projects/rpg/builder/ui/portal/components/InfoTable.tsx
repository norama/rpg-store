import { infoAtom } from '@builder/business/blocks/races/store'
import readyAtom from '@builder/ui/stores/readyAtom'
import { Show } from 'solid-js'
import { useStore } from '@nanostores/solid'
import themeHolder from 'styles/theme'
import './InfoTable.css'

interface Props {
  block: string
  width: string
}

const descriptor = [
  { key: 'name', label: 'Název' },
  { key: 'points', label: 'Body' },
  { key: 'strength', label: 'Síla' },
]

const InfoTable = ({ block, width = '100%' }: Props) => {
  const info = useStore(infoAtom)
  const theme = useStore(themeHolder.atom)
  const ready = useStore(readyAtom)

  return (
    <Show when={ready()}>
      <table class={theme()} style={{ width }}>
        <thead>
          <tr>
            {descriptor.map((col) => (
              <th>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(info())
            .sort()
            .map((id) => (
              <tr>
                {descriptor.map((col) => (
                  <td>{info()[id][col.key]}</td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </Show>
  )
}

export default InfoTable
