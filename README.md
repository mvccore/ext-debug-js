# ext-debug-js
Library to compile custom javascripts for MvcCore built in debug bar.


## Instalation
Go to directory, where you want to place and add to base MvcCore form javascript files you custom javascript support code and run:
#### Windows
```cmd
:: create new mpty directory "mvccore-ext-debug-js"
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
# create new mpty directory "mvccore-ext-debug-js"
mkdir mvccore-ext-debug-js
# clone this repository into newly created folder
git clone https://github.com/mvccore/ext-form-js mvccore-ext-debug-js
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
