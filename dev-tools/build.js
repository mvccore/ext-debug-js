require('./bin/string.js');
var fs = require('fs'),
	path = require('path'),
	execSync = require('child_process').execSync;
	
/* configuration **************************************************************************/

var sourceDir = '../src';
var targetDir = '../../mvccore/src/MvcCore/Debug';
var targetFile= 'debug.html';

/******************************************************************************************/

var advancedOptimizations = true;
var prettyPrint = false;

/******************************************************************************************/

var dirname = __dirname.replace(/\\/g, '/');

// Java path for Google Closure Compiller:
// - If you have java in %path% variable - let javaPath as empty string: var javaPath = '';
// - If not - complete javaPath variable inclluding java.exe with standard slashes - not backslashes.

// Get java path stored by install script:
var javaPath = fs.readFileSync(
	dirname + '/bin/java-home.json', 
	{encoding: 'utf-8', flag: 'r'}
).toString();
var javaPathCommentPos = javaPath.indexOf('/*');
if (javaPathCommentPos > -1) javaPath = javaPath.substr(0, javaPathCommentPos);
javaPath = javaPath.trim('"').replace(/\\/g, '/');

// Init necessary variables:
var tmpSrcFile = 'tmp.src.js',
	tmpMinFile = 'tmp.min.js',
	content = '',
	isWin = process.platform.toLowerCase().indexOf('win') > -1,
	files = {
		html: [],
		css: [],
		js: []
	},
	fileName = '',
	fileExt = '',
	fileContent = '',
	sep = '\n';
	
// Read source directory files
var fileNames = fs.readdirSync(sourceDir);

// Load all file contents:
fileNames.sort();
for (var i = 0, l = fileNames.length; i < l; i += 1) {
	fileName = fileNames[i];
	fileExt = path.extname(fileName).toLowerCase().trim('.');
	if (fileExt != 'html' && fileExt != 'css' && fileExt != 'js') continue;
	fileContent = fs.readFileSync(sourceDir + '/' + fileName, 'utf8');
	files[fileExt].push(fileContent.trim('\n\r\t;'));
}

// Minimalize JS files if there are any:
if (files.js.length > 0) {
	
	// Concatenate all JS files together:
	for (i = 0, l = files.js.length; i < l; i += 1) 
		content += files.js[i];
	
	// Store all JS files in temporary file 'tmp.src.js'
	if (fs.existsSync(tmpSrcFile)) fs.unlinkSync(tmpSrcFile);
	fs.writeFileSync(tmpSrcFile, content);
	content = '';
	console.log("Source JS files completed into single big source.");
	
	// Compile whole JS source file:
	
	// Complete compiller command file content, directory and file name:
	var currentDir = dirname + '/';
	var cmd = "cd \"%javaPath%\"\njava -jar bin/compiler/compiler.jar --compilation_level %optimalizationMode% --env BROWSER --formatting PRETTY_PRINT --js \"%inputFile%\" --hide_warnings_for \"%inputFile%\" --js_output_file \"%outputFile%\" --output_wrapper \"%output%\"\necho \"ok\"";
	cmd = cmd
		.replace(/%optimalizationMode%/g, advancedOptimizations ? 'ADVANCED_OPTIMIZATIONS' : 'SIMPLE_OPTIMIZATIONS')
		.replace(/%inputFile%/g, currentDir + tmpSrcFile)
		.replace(/%outputFile%/g, currentDir + tmpMinFile);
	if (!prettyPrint) cmd = cmd.replace(' --formatting PRETTY_PRINT', '');
	var opts = {
		//cwd: '', // Current working directory of the child process
		input: '', // The value which will be passed as stdin to the spawned process supplying this value will override stdio[0]
		stdio: [], // Child's stdio configuration. (Default: 'pipe') stderr by default will be output to the parent process' stderr unless stdio is specified
		//env: {}, // Environment key-value pairs
		//shell: '', // Shell to execute the command with (Default: '/bin/sh' on UNIX, 'cmd.exe' on Windows, The shell should understand the -c switch on UNIX or /s /c on Windows. On Windows, command line parsing should be compatible with cmd.exe.)
		//uid: 0, // Sets the user identity of the process. (See setuid(2).)
		//gid: 0, // Sets the group identity of the process. (See setgid(2).)
		//timeout: 30000, // In milliseconds the maximum amount of time the process is allowed to run. (Default: undefined)
		//killSignal: 'SIGTERM', // The signal value to be used when the spawned process will be killed. (Default: 'SIGTERM')
		//maxBuffer: 0 // largest amount of data (in bytes) allowed on stdout or stderr - if exceeded child process is killed encoding
	};
	cmd = cmd
		.replace('%javaPath%', javaPath)
		.replace('bin/compiler/compiler.jar', '"' + currentDir + 'bin/compiler/compiler.jar"');
		
	var compileCmdFileName = '';
	var compileCmdFullPath = '';
	if (isWin) {
		cmd = cmd.replace('%output%', '%%output%%');
		compileCmdFileName = 'compile.bat';
	} else {
		compileCmdFileName = 'compile.sh';
	}

	// Write compiller command file:
	compileCmdFullPath = dirname + path.sep + compileCmdFileName;
	fs.writeFileSync(compileCmdFullPath, cmd);
	
	// Execute compiller command file:
	try {
		execSync(
			(!isWin ? '/bin/sh ' : '') + compileCmdFileName, 
			opts
		);
		console.log("Single big source file minimalized into single result file.");
	} catch (e) {
		console.log("Buffer: " + e.stderr.toString('utf8'));
		process.exit();
	}

	// Unlink compiller command file:
	fs.unlinkSync(compileCmdFileName);

	
	// Read minified source JS file:
	fileContent = fs.readFileSync(currentDir + tmpMinFile, 'utf8');
	files.js = [fileContent.trim('\n\r\t;').replace(/[\r\n]/g, '')];
	
	// Remove temporary files:
	fs.unlinkSync('./tmp.src.js');
	fs.unlinkSync('./tmp.min.js');
	console.log("Removed all temporary files.");
}

// Complete whole result together:
if (files.js.length > 0) {
	for (i = 0, l = files.html.length; i < l; i += 1) 
		content += files.html[i];
}
if (files.js.length > 0) {
	content += sep + '<style>';
	for (i = 0, l = files.css.length; i < l; i += 1) 
		content += files.css[i];
	content += '</style>';
}
if (files.js.length > 0) {
	content += sep + '<script>';
	for (i = 0, l = files.js.length; i < l; i += 1) 
		content += files.js[i];
	content += '</script>';
}

// Create target dir if doesn't exist
var fieldsTargetDirStats = null;
try {
	fieldsTargetDirStats = fs.statSync(targetDir);
} catch (e) {}
if (!fieldsTargetDirStats || !fieldsTargetDirStats.isDirectory()) {
	if (fieldsTargetDirStats !== null) fs.unlinkSync(targetDir);
	fs.mkdirSync(targetDir);
}

// Write result file:
var targetFullPath = targetDir + '/' + targetFile;
if (fs.existsSync(targetFullPath)) 
	fs.unlinkSync(targetFullPath);
fs.writeFileSync(targetFullPath, content);

console.log("Result file saved successfully.");
console.log("Done.");