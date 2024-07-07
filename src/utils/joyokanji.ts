import joyokanjiJSON from '../data/joyo_kanji.json?raw'
import { shuffle } from './array'

export interface Joyokanji {
  readings: {
    reading: string
    examples: string[]
    default_reading: string
  }[]
}
export interface Joyokanjis {
  [ji: string]: Joyokanji
}

export const joyokanji: Joyokanjis = JSON.parse(joyokanjiJSON)
export const kanjis: string[] = Object.keys(joyokanji)
export const getAllReadingsShuffled = () => {
  const allReadings: {
    kanji: string
    readingIndex: number
  }[] = []
  for (const kanji of kanjis) {
    for (let i = 0; i !== joyokanji[kanji].readings.length; i++) {
      allReadings.push({
        kanji,
        readingIndex: i
      })
    }
  }
  shuffle(allReadings)
  return allReadings
}
