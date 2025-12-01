const fs = require('fs');

// Read the JSON file
const data = JSON.parse(fs.readFileSync('souls_data.json', 'utf-8'));

// Extract wikitext
const wikitext = data.query.pages[0].revisions[0].slots.main.content;

// Split into sections
const sections = {};
const normalStart = wikitext.indexOf('|-|Normal =');
const catacombsStart = wikitext.indexOf('|-|Catacombs =');
const kuudraStart = wikitext.indexOf('|-|Kuudra =');

if (normalStart !== -1 && catacombsStart !== -1) {
  sections.Normal = wikitext.substring(normalStart, catacombsStart);
}
if (catacombsStart !== -1 && kuudraStart !== -1) {
  sections.Catacombs = wikitext.substring(catacombsStart, kuudraStart);
}
if (kuudraStart !== -1) {
  sections.Kuudra = wikitext.substring(kuudraStart);
}

// Parse a wiki table section
function parseWikiTable(sectionText, sectionType) {
  const rows = [];

  // Split by row separator |-
  const tableRows = sectionText.split('|-\n');

  for (const row of tableRows) {
    if (!row.trim() || row.trim().startsWith('!')) {
      continue; // Skip headers
    }

    // Get lines starting with |
    const lines = row.split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('|'));

    if (lines.length < 6) {
      continue; // Need at least 6 columns
    }

    // Remove leading | from each cell
    const cells = lines.map(line => line.substring(1).trim());

    // Extract name (remove wiki links [[Name]])
    const name = cells[0].replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, '$1');

    // Extract level from {{Lv|1}}
    const levelMatch = cells[1].match(/\{\{Lv\|(\d+)\}\}/);
    const level = levelMatch ? levelMatch[1] : '';

    // HP, DMG, Mana Cost (remove commas)
    const hp = cells[2].replace(/,/g, '').trim();
    const dmg = cells[3].replace(/,/g, '').trim();
    const manaCost = cells[4].replace(/,/g, '').trim();

    // Drop chance from {{G|99%}}
    const dropMatch = cells[5].match(/\{\{G\|(\d+)%\}\}/);
    const dropChance = dropMatch ? dropMatch[1] + '%' : '';

    // Notes (column 6, if exists)
    let notes = '';
    if (cells.length > 6) {
      notes = cells[6]
        .replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, '$1') // Remove wiki links
        .replace(/\{\{[^}]+\}\}/g, '') // Remove templates
        .trim();
    }

    rows.push([sectionType, name, level, hp, dmg, manaCost, dropChance, notes]);
  }

  return rows;
}

// Parse all sections
const allRows = [];
for (const [sectionName, sectionText] of Object.entries(sections)) {
  const sectionRows = parseWikiTable(sectionText, sectionName);
  allRows.push(...sectionRows);
  console.log(`Parsed ${sectionRows.length} rows from ${sectionName}`);
}

// Convert to CSV
function arrayToCSV(data) {
  const header = ['type', 'name', 'level', 'hp', 'dmg', 'mana_cost', 'drop_chance', 'notes'];
  const csvRows = [header.join(',')];

  for (const row of data) {
    // Escape fields that contain commas or quotes
    const escapedRow = row.map(field => {
      const str = String(field);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    });
    csvRows.push(escapedRow.join(','));
  }

  return csvRows.join('\n');
}

// Write CSV
const csvContent = arrayToCSV(allRows);
fs.writeFileSync('necromancy_souls_list.csv', csvContent, 'utf-8');

console.log(`\nTotal rows written: ${allRows.length}`);
console.log('\nFirst 5 rows:');
for (let i = 0; i < Math.min(5, allRows.length); i++) {
  console.log(allRows[i]);
}
