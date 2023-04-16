import { jsonRequest } from 'http/util/request'
import { createResource } from 'solid-js'

const API_URL = import.meta.env.PUBLIC_BUILDER_API_URL

const fetchData = async () => (await fetch(`${API_URL}/rpgCharacterFirebase.json`)).json()

const mutateData = async (points) =>
  await fetch(`${API_URL}/rpgCharacterFirebase.json`, jsonRequest({ points }))

const RPGCharacter = () => {
  const [rpgCharacter, { refetch }] = createResource(fetchData)

  return (
    <div>
      <h2>name: {!rpgCharacter.loading && rpgCharacter().name}</h2>
      <h2>points: {!rpgCharacter.loading && rpgCharacter().points}</h2>
      <button onClick={() => mutateData(rpgCharacter().points + 1).then(() => refetch())}>
        INC
      </button>
    </div>
  )
}

export default RPGCharacter
