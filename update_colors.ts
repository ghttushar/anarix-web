import fs from 'fs';
import path from 'path';

const regex = /(?<![\/\-])text-primary(?![\/\-])/g;
const replacement = 'text-primary text-[#f26e76]';

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
      const newContent = content.replace(regex, replacement);
      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent);
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

directories.forEach(processDirectory);
