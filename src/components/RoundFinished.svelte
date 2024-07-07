<script lang="ts">
  import { incorrectIndexes, progress, allQuestions, correctRate } from '../store/questions'
  import { joyokanji } from '../utils/joyokanji'

  let isFinishedJudge = false
  export let questionsInTheRound: number[]
  export let onNext: () => void
  let questionIndexInTheRound = 0

  let correctCount = 0
  let incorrectCount = 0

  const incorrectIndexesInThis: number[] = []
  $: currentQuestionData = ((questionsInTheRound: number[]) => {
    const index = questionsInTheRound[questionIndexInTheRound]
    const inAllQuestions = $allQuestions[index]
    const reading = joyokanji[inAllQuestions.kanji].readings[inAllQuestions.readingIndex]
    const questionBody = reading.examples.map(example => example.replaceAll(inAllQuestions.kanji, `「${reading.reading}」`))

    return {
      questionBody,
      kanji: inAllQuestions.kanji,
      index
    }
  })(questionsInTheRound)

  const onJudgedAQuestion = () => {
    const newCorrectRate = {...$correctRate}
    newCorrectRate[questionIndexInTheRound] ??= { tried: 0, correct: 0 }
    newCorrectRate[questionIndexInTheRound].tried += 1
    $correctRate = newCorrectRate
    if (questionIndexInTheRound < questionsInTheRound.length - 1) {
      questionIndexInTheRound ++
    } else {
      questionIndexInTheRound = 0
      isFinishedJudge = true
    }
  }
  const handleIncorrect = () => {
    incorrectCount ++
    incorrectIndexesInThis.push(currentQuestionData.index)
    onJudgedAQuestion()
    return
  }
  const handleCorrect = () => {
    const newCorrectRate = {...$correctRate}
    newCorrectRate[questionIndexInTheRound] ??= { tried: 0, correct: 0 }
    newCorrectRate[questionIndexInTheRound].correct += 1
    $correctRate = newCorrectRate

    let hasIncorrectIndex = $incorrectIndexes.indexOf(currentQuestionData.index)
    if (hasIncorrectIndex !== -1) {
      $incorrectIndexes.splice(hasIncorrectIndex, 1)
    }
    $progress ++
    correctCount ++
    onJudgedAQuestion()
  }
</script>
<div class="h-full flex flex-col justify-around">
  <div>
    <div class="text-2xl text-center">回答確認</div>
    <hr class="p-2" />
  </div>
  {#if isFinishedJudge}
    <div class="flex justify-center gap-2">
      <div>
        <div>正解: {correctCount}</div>
        <div>不正解: {incorrectCount}</div>
      </div>
      <div class="text-3xl">
        / ${questionsInTheRound.length}
      </div>
    </div>
    <div class="text-center">
      <button class="p-2 rounded-full bg-pink-300 hover:bg-pink-400" on:click={() => {
        $incorrectIndexes = [...new Set([
          ...$incorrectIndexes,
          ...incorrectIndexesInThis
        ])]
        onNext()
      }}>次の回数へ</button>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 font-serif">
      <div class="text-9xl text-center">{currentQuestionData.kanji}</div>
      <div class="text-xl">
        {#each currentQuestionData.questionBody as body}
          <div>{body}</div>
        {/each}
      </div>
    </div>
    <div class="grid grid-cols-2 h-10 gap-2">
      <button on:click={handleIncorrect} class="p-4 rounded-md bg-pink-400">不正解</button>
      <button on:click={handleCorrect} class="p-4 rounded-md bg-pink-400">正解</button>
    </div>
  {/if}
</div>