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

// Helper function to clean floor/tier data for Catacombs and Kuudra
function cleanFloorTierData(floorText) {
  // Remove data-sort-value attribute: data-sort-value="1" | I -> I
  let cleaned = floorText.replace(/data-sort-value="[^"]*"\s*\|\s*/g, '');

  // Remove color formatting: {{Red|'''Master'''}} -> Master
  cleaned = cleaned.replace(/\{\{Red\|'''([^']+)'''\}\}/g, '$1');
  cleaned = cleaned.replace(/\{\{[^|]+\|'''([^']+)'''\}\}/g, '$1');
  cleaned = cleaned.replace(/\{\{[^|]+\|([^}]+)\}\}/g, '$1');

  // Clean up any remaining formatting
  cleaned = cleaned.replace(/'''/g, '').trim();

  return cleaned;
}

// Helper function to extract display name from wiki links
function extractWikiLinkName(text) {
  // Handle [[Link|Display Name]] format - use Display Name
  // Handle [[Name]] format - use Name
  return text.replace(/\[\[(?:[^\]|]+\|)?([^\]]+)\]\]/g, '$1');
}

// Parse a wiki table section
function parseWikiTable(sectionText, sectionType) {
  const rows = [];
  const isNormal = sectionType === 'Normal';
  const hasFloorTier = !isNormal; // Catacombs and Kuudra have floor/tier column

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

    // Normal has 6 columns, Catacombs/Kuudra have 7 columns (with floor/tier)
    const minColumns = hasFloorTier ? 7 : 6;
    if (lines.length < minColumns) {
      continue;
    }

    // Remove leading | from each cell
    const cells = lines.map(line => line.substring(1).trim());

    // Extract name (handle both [[Name]] and [[Link|Display Name]] formats)
    const name = extractWikiLinkName(cells[0]);

    // Extract level from {{Lv|1}}
    const levelMatch = cells[1].match(/\{\{Lv\|(\d+)\}\}/);
    const level = levelMatch ? levelMatch[1] : '';

    let floorTier, hp, dmg, manaCost, dropChance, notes;

    if (hasFloorTier) {
      // Catacombs/Kuudra format: Name, Level, Floor/Tier, HP, DMG, Mana Cost, Drop Chance, Notes
      floorTier = cleanFloorTierData(cells[2]);
      hp = cells[3].replace(/,/g, '').trim();
      dmg = cells[4].replace(/,/g, '').trim();
      manaCost = cells[5].replace(/,/g, '').trim();

      // Drop chance from {{G|99%}}
      const dropMatch = cells[6].match(/\{\{G\|(\d+)%\}\}/);
      dropChance = dropMatch ? dropMatch[1] + '%' : '';

      // Notes (column 7, if exists)
      notes = '';
      if (cells.length > 7) {
        notes = cells[7]
          .replace(/\[\[(?:[^\]|]+\|)?([^\]]+)\]\]/g, '$1') // Remove wiki links (handle both formats)
          .replace(/\{\{[^}]+\}\}/g, '') // Remove templates
          .trim();
      }
    } else {
      // Normal format: Name, Level, HP, DMG, Mana Cost, Drop Chance, Notes
      // Add empty floor/tier column for consistency
      floorTier = '';
      hp = cells[2].replace(/,/g, '').trim();
      dmg = cells[3].replace(/,/g, '').trim();
      manaCost = cells[4].replace(/,/g, '').trim();

      // Drop chance from {{G|99%}}
      const dropMatch = cells[5].match(/\{\{G\|(\d+)%\}\}/);
      dropChance = dropMatch ? dropMatch[1] + '%' : '';

      // Notes (column 6, if exists)
      notes = '';
      if (cells.length > 6) {
        notes = cells[6]
          .replace(/\[\[(?:[^\]|]+\|)?([^\]]+)\]\]/g, '$1') // Remove wiki links (handle both formats)
          .replace(/\{\{[^}]+\}\}/g, '') // Remove templates
          .trim();
      }
    }

    // All rows now have the same format with floor/tier column
    rows.push([sectionType, name, level, floorTier, hp, dmg, manaCost, dropChance, notes]);
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
  const header = ['type', 'name', 'level', 'floor_tier', 'hp', 'dmg', 'mana_cost', 'drop_chance', 'notes'];
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
console.log('\nFirst 5 rows from each section:');
let currentSection = '';
let sectionCount = 0;
for (let i = 0; i < allRows.length; i++) {
  if (allRows[i][0] !== currentSection) {
    currentSection = allRows[i][0];
    sectionCount = 0;
    console.log(`\n${currentSection}:`);
  }
  if (sectionCount < 5) {
    console.log(allRows[i]);
    sectionCount++;
  }
}
