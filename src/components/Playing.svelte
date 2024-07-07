<script lang="ts">
  import { get } from 'svelte/store'
  import { allQuestions, progress, incorrectIndexes, round, correctRate } from '../store/questions'
  import { kanjis, joyokanji, getAllReadingsShuffled } from '../utils/joyokanji'
  import RoundFinished from './RoundFinished.svelte'

  let questionIndexInTheRound = 0
  let byLowCorrectRate = new Set<number>()
  $: {
    if (questionIndexInTheRound === 0 && !isRoundFinished) {
      const sorted = Object.entries($correctRate).map(([name, rate]) => [name, rate.correct / rate.tried * (Math.random() * 0.3)]).sort((a, b) => a[1] < b[1] ? -1 : 1)
      byLowCorrectRate = new Set()
      for (const v of sorted.slice(0, 5)) {
        byLowCorrectRate.add(parseInt(v[0] as string))
      }
    }
  }
  /**
   * このラウンドで出題される問題のインデックス
   */
  $: questionsInTheRound = [
    ...byLowCorrectRate,
    ...$incorrectIndexes,
    ...Object.keys($allQuestions).slice($progress, $progress + 10 - $incorrectIndexes.length).map(v => parseInt(v))
  ]
  let isRoundFinished = false
  $: thisQuestionData = (() => {
    const index = questionsInTheRound[questionIndexInTheRound]
    const inAllQuestions = $allQuestions[index]
    const reading = joyokanji[inAllQuestions.kanji].readings[inAllQuestions.readingIndex]

    const questionBody = reading.examples.map(example => example.replaceAll(inAllQuestions.kanji, `「${reading.reading}」`))
    return {
      kanji: inAllQuestions.kanji,
      reading,
      questionBody,
      index
    }
  })()
</script>
{#if isRoundFinished}
  <RoundFinished questionsInTheRound={questionsInTheRound} onNext={() => {
    isRoundFinished = false
    $round ++
  }} />
{:else}
  <div class="flex flex-col h-full justify-between p-3">
    <div class="text-center">
      <div class="text-center font-bold text-lg">次の鉤括弧に共通して入る漢字を書きなさい:</div>
      <div class='flex justify-around'>
        <span>{questionIndexInTheRound + 1} / {questionsInTheRound.length}</span>
        <span class="bg-pink-600 text-white p-2 rounded-full">
          {#if $incorrectIndexes.includes(thisQuestionData.index)}
            再挑戦
          {:else if byLowCorrectRate.has(thisQuestionData.index)}
            低正答率 ({(() => {
              const rate = $correctRate[thisQuestionData.index]
              return Math.floor(rate.correct / rate.tried * 10000) / 100
            })()}%)
          {:else}
            通常
          {/if}
        </span>
      </div>
    </div>
    <div class="grid place-items-center">
      <div class="text-2xl font-serif">
        {#each thisQuestionData.questionBody as body}
          <div>{body}</div>
        {/each}
      </div>
    </div>
    <div class="flex justify-around">
      <div></div>
      <div>
        <button on:click={() => {
          if (questionIndexInTheRound < questionsInTheRound.length - 1) {
            questionIndexInTheRound ++
          } else {
            questionIndexInTheRound = 0
            isRoundFinished = true
          }
        }} class="bg-pink-300 p-2 rounded-full">次へ</button>
      </div>
    </div>
  </div>
{/if}