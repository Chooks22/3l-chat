declare module 'svelte-portal' {
  import { SvelteComponentTyped } from 'svelte'
  export default class Portal extends SvelteComponentTyped<{
    target?: HTMLElement | string
  }> {}

  export function portal(el: HTMLElement, target?: HTMLElement | string): {
    update: (newTarget: HTMLElement | string) => Promise<void>
    destroy: () => void
  }
}
