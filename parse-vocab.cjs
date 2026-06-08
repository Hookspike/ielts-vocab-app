const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '8000词.txt');
const outputFile = path.join(__dirname, 'vocabulary.json');

const content = fs.readFileSync(inputFile, 'utf-8');
const lines = content.split('\n');

const vocabulary = [];
let currentWord = null;
let skipped = 0;

lines.forEach((line, index) => {
  const trimmedLine = line.trim();
  if (!trimmedLine) return;
  
  // Skip form feed characters
  if (trimmedLine === '\f') return;
  
  // Check if line starts with a number (new word entry)
  // Handle both formats: "123 word def" and "123word def"
  const match = trimmedLine.match(/^(\d+)(\s*)([a-zA-Z-]+)(?:\s+(.+))?$/);
  
  if (match) {
    // Save previous word if exists
    if (currentWord) {
      vocabulary.push(currentWord);
    }
    
    const [, id, , word, definition] = match;
    currentWord = {
      id: parseInt(id),
      word: word,
      definition: definition ? definition.trim() : ''
    };
  } else if (currentWord) {
    // Append to current word's definition
    currentWord.definition += ' ' + trimmedLine;
  } else {
    skipped++;
    if (skipped <= 10) {
      console.log(`Skipped line ${index + 1}: ${trimmedLine.substring(0, 50)}`);
    }
  }
});

// Don't forget the last word
if (currentWord) {
  vocabulary.push(currentWord);
}

fs.writeFileSync(outputFile, JSON.stringify(vocabulary, null, 2), 'utf-8');
console.log(`Parsed ${vocabulary.length} words to ${outputFile}`);
console.log(`Skipped ${skipped} lines`);
