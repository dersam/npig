#!/usr/bin/env node

var program = require('commander');
var passwdUser = require('passwd-user');
var fs = require('fs');
var path = require('path');
var git = require('git-shizzle');
var clc = require('cli-color');

var appDir = path.dirname(require.main.filename)+'/..';
var homeDir = passwdUser.sync(process.getuid()).homedir;
var repoDir = homeDir+'/.pig';

var con = {
    error: function(entry){
        console.log(clc.red(entry));
    },
    warn: function(entry){
        console.log(clc.yellow(entry));
    },
    info: function(entry){
        console.log(clc.green(entry));
    },
    log: function(entry){
        console.log(entry);
    }
};

program
    .version('0.1.0');

program
    .command('install <manifest>')
    .description('Install from a specified manifest file.  Only new items will be cloned and added to the cache.')
    .action(function(manifest){
        //Read the manifest and install any missing packages
        con.info("Attempting to install packages from "+manifest);
        var installCache = null;
        var installConfig = JSON.parse(fs.readFileSync(manifest, 'utf8'));
        var cacheFilePath = appDir+'/cache/installcache.json';

        //Read the cache file, leave as null if it doesn't exist
        try{
            installCache = JSON.parse(fs.readFileSync(cacheFilePath,'utf8'));
        } catch(e) {
            if (e.code !== 'ENOENT') {
                con.error("Fatal error when loading install cache: ");
                throw e;
            }
        }

        var newCache = {
            listing: [],
            repos: {}
        };

        installConfig.forEach(function(item){
            //Check if package is already installed in cache
            if (installCache.listing.indexOf(item.name) !== -1) {
                //We've already cloned this repo, don't do it again
                console.info("Skipping "+item.name+": already installed.")
            } else {
                var repo = repoDir+'/'+item.name;

                //Check if this directory already exists

                //Clone repository
                console.info('Installing '+item.name+' from '+item.url);
                git().clone(item.url+' '+repo);
                //Check that repo was created
            }
            
            //Write newly installed packages to the cache file
            //Store all info from manifest, as well as the date installed
            //most recent commit hash, and local path
            newCache.listing.push(item.name);
            newCache.repos[item.name] = {
                name: item.name,
                url: item.url,
                localPath: repo
            };
        });

        //Write the install cache file
        fs.writeFileSync(cacheFilePath, JSON.stringify(newCache));
    })
;

//Update all installed packages
program.command('update');

//Wipe out the cache- destroys the cache file and the repository cache
program.command('clean');

//Remove an installed package
program.command('remove');

program.parse(process.argv);

if (!program.args.length) program.help();
