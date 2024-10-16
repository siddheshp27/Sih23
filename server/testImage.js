const fs = require('fs');


const base64String = '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';

// Remove the 'data:image/png;base64,' part if it's included
const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");

// Decode the string and convert it into a buffer
const buffer = Buffer.from(base64Data, 'base64');

// Save the buffer as an image file (e.g., a PNG)
fs.writeFileSync('output.png', buffer, (err) => {
  if (err) {
    console.error('Error writing file:', err);
  } else {
    console.log('Image saved!');
  }
});




