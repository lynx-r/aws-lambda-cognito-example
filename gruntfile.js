module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    copy: {
      build: {
        files: [
          {
            expand: true,
            cwd: './src/public',
            src: ['**'],
            dest: './dist/public'
          },
          {
            expand: true,
            cwd: './views',
            src: ['**'],
            dest: './dist/views'
          }
        ]
      }
    },
    ts: {
      app: {
        files: [{
          src: ['src/\*\*/\*.ts', '!src/.baseDir.ts'],
          dest: './dist'
        }],
        options: {
          module: 'commonjs',
          target: 'es6',
          lib: ['es7'],
          sourceMap: true,
          emitDecoratorMetadata: true,
          experimentalDecorators: true,
          typeRoots: [
            'node_modules/@types'
          ],
          types: ['reflect-metadata']
        }
      }
    },
    watch: {
      ts: {
        files: ['src/\*\*/\*.ts'],
        tasks: ['ts']
      },
      views: {
        files: ['views/**/*.pug'],
        tasks: ['copy']
      },
    },
    clean: {
      dist: ['./dist/*']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', [
    'clean',
    'copy',
    'ts'
  ]);

};