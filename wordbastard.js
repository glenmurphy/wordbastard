var solver = new (require('./solver').Solver);
var url = require('url');
var http = require('http');
var fs = require('fs');

// TODO: Public/private results

/**
 * Files
 */
function File(path) {
  this.content = '';
  this.fullpath = __dirname + path;
  fs.watch(this.fullpath, this.refreshContent.bind(this));
  this.refreshContent();
}

File.prototype.refreshContent = function() {
  fs.readFile(this.fullpath, "ascii", (function(error, file) {
    if (file) this.content = file;
  }).bind(this));
};

/**
 * Files
 */
function Files(paths) {
  this.files = [];
  for (var i = 0; i < paths.length; i++) {
    this.addFile(paths[i]);
  }
}

Files.prototype.addFile = function(path) {
  if (path in this.files) {
    return content.log("ERROR: Files "+path+" already entered");
  }
  this.files[path] = new File(path);
};

Files.prototype.getFile = function(path) {
  if (path in this.files) {
    return this.files[path].content;
  } else {
    console.log("ERROR: Files path not found: " + path);
    return "";
  }
}

function WordBastard() {
  this.files = new Files([
    "/client/index.html",
    "/client/functions.js",
    "/client/gmbase.js",
    "/client/input.js"
  ]);
  this.server = http.createServer(this.handleReq.bind(this));
  this.server.listen(4000);
  console.log('Server running');
}

WordBastard.prototype.handleReq = function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  var query = url.parse(req.url);
  var path = query.pathname.split("/");

  if (path[1] == 'solve' && path.length > 2 && path[2] != "") {
    var result = solver.solve(path[2], 3);
    res.write(result.join("\n"));
  } else if (path.length == 2) {
    var local_path = "/client/" + (path[1] ? path[1] : "index.html");
    console.log(local_path);
    if (local_path in this.files.files) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(this.files.getFile(local_path), "ascii");    
    }
  }

  res.end('\n');
};

new WordBastard();