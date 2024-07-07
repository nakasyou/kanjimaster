<script lang="ts">
  import Playing from './components/Playing.svelte'
  import { progress, allQuestions } from './store/questions'
  let isStarted = false
</script>
<main class="bg-gradient-to-b from-pink-50 to-rose-100 h-[100dvh] p-2">
  {#if isStarted}
    <Playing />
  {:else}
    <div class="h-full grid grid-rows-3 place-items-center">
      <div>
        <div class="text-3xl text-center font-bold">常用漢字名人</div>
        <div>{$progress} / {$allQuestions.length} の学習が完了 ({Math.floor($progress / $allQuestions.length * 10000) / 100}%)</div>
      </div>
      <div class="text-center">
        <div>紙と筆記用具を用意したなら？:</div>
        <button on:click={() => isStarted = true} class="bg-pink-300 drop-shadow-sm hover:drop-shadow-none p-2 text-2xl rounded-md">開始</button>
      </div>
    </div>
  {/if}
</main>
