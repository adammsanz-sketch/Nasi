import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(/stroke="#f1f5f9"/g, 'stroke="#27272a"');
fs.writeFileSync('src/App.tsx', content);
