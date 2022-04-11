# MvcCore - Debug - Javascripts

[![Latest Stable Version](https://img.shields.io/badge/Stable-v5.0.0-brightgreen.svg?style=plastic)](https://github.com/mvccore/ext-debug-js/releases)
[![License](https://img.shields.io/badge/License-BSD%203-brightgreen.svg?style=plastic)](https://mvccore.github.io/docs/mvccore/5.0.0/LICENSE.md)
[![Google Closure Build](https://img.shields.io/badge/Google%20Closure%20Build-passing-brightgreen.svg?style=plastic)](https://developers.google.com/closure/compiler/)

Node.JS builder to compile custom javascript for PHP MvcCore library debug bar ([mvccore/mvccore](https://github.com/mvccore/mvccore)).

Javascript files in current stable version `5.0` are compatible with `MvcCore` framework with version `4.x` and `5.x`.

Custom javascripts are compiled by **Google Closure Compiller** with advanced compilation.


## Instalation
Go to directory, where is directory with `mvccore/mvccore` core source files  
(`https://github.com/mvccore/mvccore/tree/master/src/MvcCore`) and run:

#### Windows
```cmd
:: create new empty directory "mvccore-ext-debug-js"
mkdir mvccore-ext-debug-js

:: clone this repository into newly created folder
git clone https://github.com/mvccore/ext-debug-js mvccore-ext-debug-js

:: go to repository folder
cd mvccore-ext-debug-js

:: go to repository latest release (optional)
php -r "$a=shell_exec('git ls-remote --tags .');$b=explode('refs/tags/',$a);$c=trim($b[count($b)-1]);shell_exec('git checkout tags/'.$c);"

:: remove whole '.git' directory, git history (you don't need this repository history in your project repo)
rmdir /S /Q .git

:: load this node package dependencies
call npm update

:: call this node package install script
call node install.js

:: follow instructions on the screen
```
#### Linux
```shell
#!/bin/bash

# create new empty directory "mvccore-ext-debug-js"
mkdir mvccore-ext-debug-js

# clone this repository into newly created folder
git clone https://github.com/mvccore/ext-debug-js mvccore-ext-debug-js

# go to repository folder
cd mvccore-ext-debug-js

# go to repository latest release (optional)
php -r "$a=shell_exec('git ls-remote --tags .');$b=explode('refs/tags/',$a);$c=trim($b[count($b)-1]);shell_exec('git checkout tags/'.$c);"

# remove whole '.git' directory, git history (you don't need this repository history in your project repo)
rm -r -f .git

# load this node package dependencies
sh -c "npm update"

# call this node package install script
sh -c "node install.js"

# follow instructions on the screen
```

## Extending and custom javascript development
- add, change or remove anything in "mvccore-ext-debug-js/src/*.js"
- configure output location in "mvccore-ext-debug-js/dev-tools/build.js"
- build your new javascript files

## Building

#### Windows
```shell
cd mvccore-ext-debug-js/dev-tools
build.cmd
```
#### Linux
```shell
cd mvccore-ext-debug-js/dev-tools
sh build.sh
```

### Configuration
- open file "mvccore-ext-form-js/dev-tools/build.js"
- edit lines 9 and 10 to change compiled result file `debug.html` destination