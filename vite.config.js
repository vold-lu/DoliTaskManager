import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {viteStaticCopy} from 'vite-plugin-static-copy'
import {resolve} from 'path'

export default defineConfig({
    plugins: [
        react(),
        viteStaticCopy({
            targets: [
                {src: 'src/background.js', dest: ''},
                {src: 'src/content-common.js', dest: ''},
                {src: 'src/content-jira.js', dest: ''},
                {src: 'src/content-jira.css', dest: ''},
                {src: 'src/content-gitlab.js', dest: ''},
                {src: 'src/content-gitlab.css', dest: ''}
            ]
        })
    ],
    build: {
        rollupOptions: {
            input: {
                popup: resolve(__dirname, 'index.html')
            },
            output: {
                entryFileNames: '[name].js'
            }
        },
        outDir: 'dist',
        emptyOutDir: true
    }
})
