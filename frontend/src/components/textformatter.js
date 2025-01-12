const fs = require('fs');
const path = require('path');

const formatTextToHTML = (inputText) => {
  if (!inputText) return "";

  // Split text into lines based on newline characters
  const lines = inputText.split(/\r?\n/);

  // Filter out empty lines and wrap each line with <p> tags
  const formattedText = lines
    .reduce((acc, line) => {
      const trimmedLine = line.trim();
      if (trimmedLine === "") {
        // Add a blank space if an empty line is encountered
        acc.push("<br>");
      } else {
        // Add a paragraph tag for non-empty lines
        acc.push(`<p>${trimmedLine}</p>`);
      }
      return acc;
    }, [])
    .join("\n"); // Join with newline for readability

  return formattedText;
};

// Example usage: Reading input from a .txt file
const inputFilePath = path.join(__dirname, 'input.txt'); // Replace with your .txt file path

fs.readFile(inputFilePath, 'utf-8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  const formattedOutput = formatTextToHTML(data);
  console.log("Formatted Text:", formattedOutput);

  // Optionally, save the formatted output to a new file
  const outputFilePath = path.join(__dirname, 'output.html');
  fs.writeFile(outputFilePath, formattedOutput, 'utf-8', (writeErr) => {
    if (writeErr) {
      console.error('Error writing to file:', writeErr);
    } else {
      console.log('Formatted text saved to:', outputFilePath);
    }
  });
});