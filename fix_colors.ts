import fs from 'fs';
import path from 'path';

// Undo the aggressive match on hover:, focus:, etc.
const fixRegex = /([a-z0-9-]+):text-primary text-\[#f26e76\]/g;
const fixReplacement = '$1:text-primary'; 

// Also, if someone really wanted hover pink, they would ask for hover:text-[#f26e76]
// But for now, let's just stick to the literal request.

const directories = ['src/website/components', 'src/website/pages', 'src/components/aan'];

function processDirectory(dir: string) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const newContent = content.replace(fixRegex, fixReplacement);
      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent);
        console.log(`Fixed: ${fullPath}`);
      }
    }
  }
}

directories.forEach(processDirectory);
