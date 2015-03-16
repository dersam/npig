# npig
Packages In Git - package manager for managing git repositories

npig.example.json - example definition of a repository
Install using a manifest file- the contents will be added to the pig cache.

Update all tracked packages with npig update.

Build the bashrc hook file with npig rebuild. The generated file should be
sourced in your bashrc- this will link in all tracked dotfile repos based on
settings in sourceFiles and bashExec.

Destroy the cache with npig clean.  If you have changes, doing a clean and then
doing npig install will rebuild the cache, without redownloading or updating
your packages.  This is good for if you change your bashExec or sourceFiles config.
