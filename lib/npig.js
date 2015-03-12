#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');

var obj = JSON.parse(fs.readFileSync('file', 'utf8'));

program
    .version('0.1.0');

program
    .command('install')
    .action(function(){
        console.log('install');
    })
;

program.parse(process.argv);
