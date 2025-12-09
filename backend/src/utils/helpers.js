function parseDate(v) {
  if (!v) return null;
  const d = new Date(v);
  if (!isNaN(d)) return d;
  const parts = String(v).split(/[\/\-]/);
  if (parts.length === 3) {
    const [d1, m1, y1] = parts.map(Number);
    if (!isNaN(d1) && !isNaN(m1) && !isNaN(y1)) return new Date(y1, m1 - 1, d1);
  }
  return null;
}

module.exports = { parseDate };
