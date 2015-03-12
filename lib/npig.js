#!/usr/bin/env node

var program = require('commander');
var passwdUser = require('passwd-user');
var fs = require('fs');
var path = require('path');
var git = require('git-shizzle');

var appDir = path.dirname(require.main.filename)+'/..';
var repoDir = appDir+'/repos';
var homeDir = passwdUser.sync(process.getuid()).homedir;

program
    .version('0.1.0');

program
    .command('install <manifest>')
    .action(function(manifest){
        //Read the manifest and install any missing packages
        var installConfig = JSON.parse(fs.readFileSync(manifest, 'utf8'));
        console.log(installConfig);

        //Read the cache file
        //var installCache = JSON.parse(fs.openSync(appDir+'/cache/installcache.json', 'r'));

        installConfig.forEach(function(item){
            //Check if package is already installed in cache
            console.log(item);
            //Clone repository
            var repo = repoDir+'/'+item.name;
            console.log(repo);
            git().clone(item.url+' '+repo);

            //Write newly installed packages to the cache file
            //Store all info from manifest, as well as the date installed
            //most recent commit hash, and local path
        });
    })
;

//Update all installed packages
program.command('update');

//Wipe out the cache- destroys the cache file and the repository cache
program.command('clean');

//Remove an installed package
program.command('remove');

program.parse(process.argv);
