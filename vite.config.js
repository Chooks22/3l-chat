import { sveltekit } from '@sveltejs/kit/vite'
import mkcert from 'vite-plugin-mkcert'

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [
    sveltekit(),
    mkcert(),
  ],
}

export default config
