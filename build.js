var fs = require('fs');
var minify = require('minify');
var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;
var util = require('util')

function min(content){
	var orig_code = content;
	var ast = jsp.parse(orig_code); // parse code and get the initial AST
	ast = pro.ast_mangle(ast); // get a new AST with mangled names
	ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
	var final_code = pro.gen_code(ast); // compressed code here
	return final_code;
}

var index_template = fs.readFileSync('tmpl/index.teplate', 'utf8');
var script_template = fs.readFileSync('tmpl/script.teplate', 'utf8');
var google_script_template = fs.readFileSync('tmpl/google_analytics.js', 'utf8');
var repo = fs.readFileSync('tmpl/repository.js', 'utf8');

var script = repo + script_template;

var html = index_template.replace('#####SCRIPT#####', min(script)).replace('#####SCRIPT-GOOGLE#####', min(google_script_template));
fs.writeFileSync('index.html', html, 'utf8');
minify.optimize(['index.html']);

var source_file = 'node_modules/minify/min/index.min.html';
var source_file_content = fs.readFileSync(source_file, 'utf8');
fs.writeFileSync('index.html', html, 'utf8');
