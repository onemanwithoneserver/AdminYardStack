import fs from 'fs';
import path from 'path';

function collapseNamedImports(content) {
  // 1. import Header, { ... } from '...'
  content = content.replace(
    /import\s+([A-Za-z0-9_$]+),\s*\{([\s\S]*?)\}\s*from\s*(['"][^'"]+['"]);?/g,
    (match, defaultImport, namedBlock, modulePath) => {
      const items = namedBlock
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      return `import ${defaultImport}, { ${items.join(', ')} } from ${modulePath};`;
    }
  );

  // 2. import type { ... } from '...'
  content = content.replace(
    /import\s+type\s*\{([\s\S]*?)\}\s*from\s*(['"][^'"]+['"]);?/g,
    (match, namedBlock, modulePath) => {
      const items = namedBlock
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      return `import type { ${items.join(', ')} } from ${modulePath};`;
    }
  );

  // 3. import { ... } from '...'
  content = content.replace(
    /import\s*\{([\s\S]*?)\}\s*from\s*(['"][^'"]+['"]);?/g,
    (match, namedBlock, modulePath) => {
      const items = namedBlock
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      return `import { ${items.join(', ')} } from ${modulePath};`;
    }
  );

  // 4. export type { ... } from '...'
  content = content.replace(
    /export\s+type\s*\{([\s\S]*?)\}\s*from\s*(['"][^'"]+['"]);?/g,
    (match, namedBlock, modulePath) => {
      const items = namedBlock
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      return `export type { ${items.join(', ')} } from ${modulePath};`;
    }
  );

  // 5. export { ... } from '...'
  content = content.replace(
    /export\s*\{([\s\S]*?)\}\s*from\s*(['"][^'"]+['"]);?/g,
    (match, namedBlock, modulePath) => {
      const items = namedBlock
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      return `export { ${items.join(', ')} } from ${modulePath};`;
    }
  );

  // 6. export { ... }; (without from)
  content = content.replace(
    /export\s*\{([\s\S]*?)\};/g,
    (match, namedBlock) => {
      // Avoid matching if it contains newlines with comments
      if (namedBlock.includes('//') || namedBlock.includes('/*')) return match;
      const items = namedBlock
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (items.length > 0 && items.length < 25) {
        return `export { ${items.join(', ')} };`;
      }
      return match;
    }
  );

  // 7. Collapse more than one consecutive blank lines
  content = content.replace(/\n{3,}/g, '\n\n');

  return content;
}

function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let count = 0;

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      count += processDirectory(fullPath);
    } else if (
      entry.isFile() &&
      (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.js'))
    ) {
      const original = fs.readFileSync(fullPath, 'utf8');
      const updated = collapseNamedImports(original);
      if (original !== updated) {
        fs.writeFileSync(fullPath, updated, 'utf8');
        count++;
      }
    }
  }

  return count;
}

const targetDir = process.argv[2] || 'src';
const absoluteTargetDir = path.resolve(process.cwd(), targetDir);

console.log(`Processing files in: ${absoluteTargetDir}`);
const updatedCount = processDirectory(absoluteTargetDir);
console.log(`Successfully formatted imports in ${updatedCount} files.`);
