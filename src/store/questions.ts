import { writable } from 'svelte/store'
import { getAllReadingsShuffled } from '../utils/joyokanji'
import localforage from 'localforage'

export const round = writable(0)
export const allQuestions = writable(getAllReadingsShuffled())
export const progress = writable(0)
export const incorrectIndexes = writable<number[]>([])
export const correctRate = writable<{
  [index: number]: {
    tried: number
    correct: number
  }
}>({})

const stores = {
  round,
  progress,
  allQuestions,
  incorrectIndexes,
  correctRate
}
for (const [name, store] of Object.entries(stores)) {
  localforage.getItem(name).then((v) => {
    if (!v) {
      return
    }
    store.set(JSON.parse(v as string))
    store.subscribe(v => {
      localforage.setItem(name, JSON.stringify(v))
    })
  })
}
