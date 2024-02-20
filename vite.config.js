import { defineConfig } from 'vite';
import { exec } from 'child_process';

export default defineConfig({
  root: './src',
  build: {
    outDir: '../dist',
    // watch: {
    //   include: './src/**',
    // },
  },
  plugins: [
      {
        name: 'postbuild-commands', // the name of your custom plugin. Could be anything.
        handleHotUpdate: async () => {
            exec('npm run test', (err, stdout, stderr) => {
                if (err) {
                  console.log(`error: ${err.message}`);
                  // node couldn't execute the command
                  return;
                }
                // the *entire* stdout and stderr (buffered)
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
              });
        }
      },
  ]
  })