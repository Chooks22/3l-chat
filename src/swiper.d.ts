declare namespace svelte.JSX {
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style, @typescript-eslint/no-unused-vars
  interface HTMLAttributes<T> {
    [key: `data-${string}`]: string
    modules?: unknown[]
    hashNavigation?: unknown
  }
}
