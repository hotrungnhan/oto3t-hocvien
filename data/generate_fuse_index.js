import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { csvParse } from 'd3-dsv';
import fuse from 'fuse.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const csvFilePath = resolve(__dirname, '../src/assets/output.csv');
const jsonIndexPath = resolve(__dirname, '../src/assets/output.index.json');

// Load and parse the CSV file
const csvContent = readFileSync(csvFilePath, 'utf-8');
const data = csvParse(csvContent);

// Generate Fuse.js index
const fuseIndex = fuse.createIndex(["name"], data);

// Write the index to a file
writeFileSync(jsonIndexPath, JSON.stringify(fuseIndex.toJSON()));
console.log('Fuse.js index written to json.index');
