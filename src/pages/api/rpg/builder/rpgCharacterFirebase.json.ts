import { jsonResponse } from 'http/util/response'
import { db } from 'projects/rpg/lib/firebase/client'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

const docRef = doc(db, 'rpgCharacters', '1')

export async function get() {
  const docSnap = await getDoc(docRef)

  return jsonResponse(docSnap.data())
}

export async function post({ request }) {
  if (request.headers.get('Content-Type') === 'application/json') {
    const rpgCharacter = await request.json()

    await updateDoc(docRef, rpgCharacter)

    return jsonResponse({ result: 'SUCCESS' })
  } else {
    return new Response(null, { status: 400 })
  }
}
