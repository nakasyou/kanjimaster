import './app.css'
import App from './App.svelte'

if (import.meta.env.DEV) {
  const script = document.createElement('script')
  script.src = 'https://cdn.jsdelivr.net/npm/eruda'
  // @ts-ignore global eruda
  script.onload = () => globalThis.eruda.init()
  document.body.append(script)
}

const app = new App({
  target: document.getElementById('app')!,
})

export default app
