const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const { parseDate } = require('../utils/helpers');

const DATA_PATH = path.join(__dirname, '..', '..', 'data', 'sales.json');
let SALES = [];
try {
  SALES = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
} catch (e) {
  console.warn('Could not load sales dataset:', e.message);
  SALES = [];
}

function toArrayParam(val) {
  if (!val) return null;
  if (Array.isArray(val)) return val;
  return String(val).split(',').map(s => s.trim()).filter(Boolean);
}

function querySales(qs) {
  let items = SALES.slice();

  if (qs.q) {
    const q = qs.q.toLowerCase();
    items = items.filter(it => {
      const name = (it['Customer Name'] || '').toString().toLowerCase();
      const phone = (it['Phone Number'] || '').toString().toLowerCase();
      return name.includes(q) || phone.includes(q);
    });
  }

  const regions = toArrayParam(qs.regions);
  if (regions) items = items.filter(it => regions.includes((it['Customer Region'] || '').toString()));

  const genders = toArrayParam(qs.gender);
  if (genders) items = items.filter(it => genders.includes((it['Gender'] || '').toString()));

  if (qs.ageMin || qs.ageMax) {
    const min = Number(qs.ageMin) || 0;
    const max = Number(qs.ageMax) || 200;
    items = items.filter(it => {
      const age = Number(it['Age']) || 0;
      return age >= min && age <= max;
    });
  }

  const categories = toArrayParam(qs.category);
  if (categories) items = items.filter(it => categories.includes((it['Product Category'] || '').toString()));

  const tags = toArrayParam(qs.tags);
  if (tags) items = items.filter(it => {
    const itemTags = (it['Tags'] || '').toString().split(',').map(s=>s.trim());
    return tags.every(t => itemTags.includes(t));
  });

  const payments = toArrayParam(qs.payment);
  if (payments) items = items.filter(it => payments.includes((it['Payment Method'] || '').toString()));

  if (qs.dateFrom || qs.dateTo) {
    const from = parseDate(qs.dateFrom) || new Date('1970-01-01');
    const to = parseDate(qs.dateTo) || new Date('3000-01-01');
    items = items.filter(it => {
      const d = parseDate(it['Date']);
      return d >= from && d <= to;
    });
  }

  const sortBy = qs.sortBy || 'Date';
  const dir = (qs.sortDir || 'desc').toLowerCase();
  const validSort = ['Date', 'Quantity', 'Customer Name'];
  if (validSort.includes(sortBy)) {
    items = _.orderBy(items, [it => {
      if (sortBy === 'Date') return parseDate(it['Date']);
      if (sortBy === 'Quantity') return Number(it['Quantity']) || 0;
      if (sortBy === 'Customer Name') return (it['Customer Name'] || '').toLowerCase();
      return it[sortBy];
    }], [dir === 'asc' ? 'asc' : 'desc']);
  }

  const pageSize = Math.max(1, Number(qs.pageSize) || 10);
  const page = Math.max(1, Number(qs.page) || 1);
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);

  return {
    meta: { total, page, pageSize, totalPages },
    data: paged
  };
}

module.exports = { querySales };
