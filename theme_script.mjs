import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(/text-black text-black/g, 'text-black');
content = content.replace(/flex h-screen bg-slate-50 font-sans text-slate-900/g, 'flex h-screen bg-[#0a0a0a] font-sans text-white'); // ensure main wrapper is black
fs.writeFileSync('src/App.tsx', content);
