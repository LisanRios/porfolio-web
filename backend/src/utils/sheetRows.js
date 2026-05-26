export function rowsToObjects(values = []) {
  const [headers = [], ...rows] = values;

  return rows
    .map((row, index) => {
      const item = headers.reduce((record, header, columnIndex) => {
        record[header] = row[columnIndex] ?? '';
        return record;
      }, {});

      return {
        ...item,
        rowNumber: index + 2,
      };
    })
    .filter((row) => Object.values(row).some((value) => value !== ''));
}

export function isActive(value) {
  return String(value || 'TRUE').toLowerCase() !== 'false';
}

export function parseJsonCell(value, fallback) {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function stringifyJsonCell(value) {
  return JSON.stringify(value ?? []);
}

export function makeId(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
