import { sveltekit } from '@sveltejs/kit/vite'
import mkcert from 'vite-plugin-mkcert'

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [
    sveltekit(),
  ],
}

if (process.argv.includes('--https')) {
  config.plugins.push(mkcert())
}

export default config
