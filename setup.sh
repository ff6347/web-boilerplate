#!/bin/bash
git init
echo "Hello World" > README.md
echo ".DS_Store" > .gitignore
echo "*.sublime-workspace" >> .gitignore
echo "*.sublime-project" >> .gitignore
echo "node_modules/" >> .gitignore
echo "node_modules/" >> .gitignore
echo "bower_components/" >> .gitignore
npm init
bower init
npm install grunt grunt-contrib-watch grunt-contrib-connect load-grunt-tasks grunt-contrib-copy grunt-bower-task grunt-bower-install grunt-text-replace  grunt-contrib-stylus  grunt-contrib-jade  connect-livereload grunt-contrib-coffee grunt-open --save-dev
git add -A
git commit -a -m"initial local commit"
