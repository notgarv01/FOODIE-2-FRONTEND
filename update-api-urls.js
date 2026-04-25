const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      processFile(filePath);
    }
  });
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already has the import
  if (content.includes("import { API_URL }")) {
    return;
  }
  
  // Skip if no localhost:3000 references
  if (!content.includes('http://localhost:3000')) {
    return;
  }
  
  // Add import after the first import statement
  const importRegex = /^import .+ from ['"].+['"];?\s*\n/m;
  const importMatch = content.match(importRegex);
  
  if (importMatch) {
    const lastImportEnd = importMatch.index + importMatch[0].length;
    content = content.slice(0, lastImportEnd) + 
              "import { API_URL } from '../../utils/api';\n" + 
              content.slice(lastImportEnd);
  } else {
    // If no imports, add at the top
    content = "import { API_URL } from '../../utils/api';\n" + content;
  }
  
  // Replace all http://localhost:3000 with ${API_URL}
  content = content.replace(/'http:\/\/localhost:3000/g, `\${API_URL}`);
  content = content.replace(/"http:\/\/localhost:3000/g, `\${API_URL}`);
  
  // Fix template literal syntax
  content = content.replace(/\$\{API_URL\}\/api/g, `${API_URL}/api`);
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated: ${filePath}`);
}

processDirectory(srcDir);
console.log('Done!');
