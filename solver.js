var fs = require('fs');

function Solver(dictionary) {
  this.generateDictionary();
}

Solver.prototype.generateDictionary = function() {
  var dictionary = {};

  function addWord(word) {
    var dict = dictionary;
    for (var i = 0; i < word.length; i++) {
      var letter = word.charAt(i);
      if (!(letter in dict)) {
        dict[letter] = {}
      }
      dict = dict[letter];
    }
    dict.word = word; // only present for nodes that are words themselves.
  }

  var data = fs.readFileSync('owl.txt', 'utf8');
  data = data.split("\n");

  for (var i = 0; i < data.length; i++) {
    if (!data[i]) continue;
    var line = data[i].split(" ");
    var word = line[0].toLowerCase();
    addWord(word);
  }

  this.dictionary = dictionary;
};

Solver.prototype.createRemaining = function(list, index) {
  var output = [];
  for (var i = 0; i < list.length; i++) {
    if (i != index) output.push(list[i]);
  }
  return output;
};

Solver.prototype.getChildWords = function(dict, remaining, results) { 
  if (!!dict.word && !(dict.word in results)) {
    results.push(dict.word);
  }

  for (var i = 0; i < remaining.length; i++) {
    var letter = remaining[i];
    if (letter in dict) {
      this.getChildWords(dict[letter], this.createRemaining(remaining, i), results);
    }
  }
};

Solver.prototype.solve = function(word, minimum) {
  minimum = minimum ? minimum : 3;
  var results = [];
  this.getChildWords(this.dictionary, word.split(''), results);
  results.sort();

  var output = [];
  var last = '';
  for (var i = 0; i < results.length; i++) {
    if (results[i] != last && results[i].length >= minimum)
      output.push(results[i]);
    last = results[i];
  }
  /*
  output.sort(function(a, b) {
    return a.length - b.length;
  })
  */

  return output;
};

exports.Solver = Solver;