const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function getImportPath(filePath) {
  const relative = path.relative(path.dirname(filePath), path.join(__dirname, 'src', 'utils', 'api.js'));
  return relative.replace(/\\/g, '/');
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already has the import
  if (content.includes("import { API_URL }")) {
    console.log(`Skipped (already has import): ${filePath}`);
    return;
  }
  
  // Skip if no localhost:3000 references
  if (!content.includes('http://localhost:3000')) {
    console.log(`Skipped (no localhost): ${filePath}`);
    return;
  }
  
  const importPath = getImportPath(filePath);
  
  // Find the last import line and add our import after it
  const lines = content.split('\n');
  let lastImportIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      lastImportIndex = i;
    }
  }
  
  if (lastImportIndex >= 0) {
    lines.splice(lastImportIndex + 1, 0, `import { API_URL } from '${importPath}';`);
  } else {
    lines.unshift(`import { API_URL } from '${importPath}';`);
  }
  
  content = lines.join('\n');
  
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
    } else if ((file.endsWith('.jsx') || file.endsWith('.js')) && !file.includes('api.js')) {
      processFile(filePath);
    }
  });
}

console.log('Starting batch update...\n');
processDirectory(srcDir);
console.log('\nBatch update complete!');
