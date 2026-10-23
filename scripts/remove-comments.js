import fs from 'fs';
import path from 'path';

export function stripCommentsFromCode(code) {
  let cleaned = code.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

  let result = '';
  let i = 0;
  const len = cleaned.length;

  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inTemplateString = false;
  let inBlockComment = false;
  let inLineComment = false;

  while (i < len) {
    const char = cleaned[i];
    const nextChar = i + 1 < len ? cleaned[i + 1] : '';
    const prevChar = i > 0 ? cleaned[i - 1] : '';

    if (inLineComment) {
      if (char === '\n' || char === '\r') {
        inLineComment = false;
        result += char;
      }
      i++;
      continue;
    }

    if (inBlockComment) {
      if (char === '*' && nextChar === '/') {
        inBlockComment = false;
        i += 2;
        continue;
      }
      i++;
      continue;
    }

    if (inSingleQuote) {
      result += char;
      if (char === '\'' && prevChar !== '\\') {
        inSingleQuote = false;
      }
      i++;
      continue;
    }

    if (inDoubleQuote) {
      result += char;
      if (char === '"' && prevChar !== '\\') {
        inDoubleQuote = false;
      }
      i++;
      continue;
    }

    if (inTemplateString) {
      result += char;
      if (char === '`' && prevChar !== '\\') {
        inTemplateString = false;
      }
      i++;
      continue;
    }

    if (char === '/' && nextChar === '/') {
      inLineComment = true;
      i += 2;
      continue;
    }

    if (char === '/' && nextChar === '*') {
      inBlockComment = true;
      i += 2;
      continue;
    }

    if (char === '\'') {
      inSingleQuote = true;
      result += char;
      i++;
      continue;
    }

    if (char === '"') {
      inDoubleQuote = true;
      result += char;
      i++;
      continue;
    }

    if (char === '`') {
      inTemplateString = true;
      result += char;
      i++;
      continue;
    }

    result += char;
    i++;
  }

  result = result.replace(/^\s*\{\}\s*$/gm, '');

  return result;
}

export function removeCommentsUnderFolder(targetFolder) {
  const resolvedPath = path.resolve(process.cwd(), targetFolder);

  if (!fs.existsSync(resolvedPath)) {
    console.error(`Folder not found: ${resolvedPath}`);
    return;
  }

  const supportedExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.css']);
  let modifiedCount = 0;

  function traverse(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist') {
          traverse(fullPath);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (supportedExtensions.has(ext)) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const stripped = stripCommentsFromCode(content);

          if (content !== stripped) {
            fs.writeFileSync(fullPath, stripped, 'utf8');
            console.log(`Cleaned comments from: ${path.relative(process.cwd(), fullPath)}`);
            modifiedCount++;
          }
        }
      }
    }
  }

  traverse(resolvedPath);
  console.log(`Completed. Removed comments from ${modifiedCount} file(s) under "${targetFolder}".`);
}

const targetArg = process.argv[2] || 'src';
removeCommentsUnderFolder(targetArg);
