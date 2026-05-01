import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Income/Expense labels
content = content.replace(/bg-emerald-50 text-emerald-700 border-emerald-200/g, 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20');
content = content.replace(/bg-rose-50 text-rose-700 border-rose-200/g, 'bg-rose-500/10 text-rose-400 border-rose-500/20');
content = content.replace(/bg-amber-50 text-amber-700 border-amber-200/g, 'bg-amber-500/10 text-amber-400 border-amber-500/20');

// Hover actions
content = content.replace(/hover:bg-rose-50/g, 'hover:bg-rose-500/10');
content = content.replace(/hover:text-rose-600/g, 'hover:text-rose-400');

// Stock status
content = content.replace(/bg-emerald-100 text-emerald-700/g, 'bg-emerald-500/10 text-emerald-400');
content = content.replace(/bg-amber-100 text-amber-700/g, 'bg-amber-500/10 text-amber-400');
content = content.replace(/bg-rose-100 text-rose-700/g, 'bg-rose-500/10 text-rose-400');

// Order status
content = content.replace(/bg-blue-100 text-blue-700/g, 'bg-sky-500/10 text-sky-400');

// Additional dark mode tweaks
content = content.replace(/bg-slate-50\/50/g, 'bg-zinc-800/50');
// In case of text-slate-900 remaining
content = content.replace(/text-slate-900/g, 'text-zinc-100');

fs.writeFileSync('src/App.tsx', content);
