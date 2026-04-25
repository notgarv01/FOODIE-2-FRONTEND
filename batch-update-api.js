const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const apiUtilsPath = path.join(__dirname, 'src', 'utils', 'api.js');

function getRelativePath(filePath, srcDir) {
  const relative = path.relative(path.dirname(filePath), apiUtilsPath);
  return relative.replace(/\\/g, '/');
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already has the import
  if (content.includes("import { API_URL }")) {
    console.log(`Skipped (already updated): ${filePath}`);
    return;
  }
  
  // Skip if no localhost:3000 references
  if (!content.includes('http://localhost:3000')) {
    console.log(`Skipped (no localhost): ${filePath}`);
    return;
  }
  
  // Calculate relative import path
  const relativePath = getRelativePath(filePath, srcDir);
  
  // Add import after the first import statement
  const importRegex = /^import .+ from ['"].+['"];?\s*\n/m;
  const importMatch = content.match(importRegex);
  
  if (importMatch) {
    const lastImportEnd = importMatch.index + importMatch[0].length;
    content = content.slice(0, lastImportEnd) + 
              `import { API_URL } from '${relativePath}';\n` + 
              content.slice(lastImportEnd);
  } else {
    // If no imports, add at the top
    content = `import { API_URL } from '${relativePath}';\n` + content;
  }
  
  // Replace all http://localhost:3000 with ${API_URL}
  content = content.replace(/'http:\/\/localhost:3000/g, '${API_URL}');
  content = content.replace(/"http:\/\/localhost:3000/g, '${API_URL}');
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated: ${filePath}`);
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      // Skip the api.js file itself
      if (!filePath.includes('api.js')) {
        processFile(filePath);
      }
    }
  });
}

processDirectory(srcDir);
console.log('\nBatch update complete!');
