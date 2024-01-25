import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';


const htmlImport = {
  name: "htmlImport",
  /**
   * Checks to ensure that a html file is being imported.
   * If it is then it alters the code being passed as being a string being exported by default.
   * @param {string} code The file as a string.
   * @param {string} id The absolute path. 
   * @returns {{code: string}}
   */
  transform(code, id) {
    // if (/^.*\.html$/g.test(id)) {
    //   code = `export default \`${code}\``
    // }
    return { code }
  }
}

export default defineConfig({
  root: './src',
  build: {
    outDir: '../dist',
    minify: false,
    emptyOutDir: true,
  },
  assetsInclude: ['./assets/**'],
  plugins: [preact({include: /ui\/\.*/}), htmlImport],
  resolve: {
    alias: {
      react: 'preact/compat',
    },
  },
});
