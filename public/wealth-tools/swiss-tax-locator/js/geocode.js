/* Nominatim geocoding with rate-limited queue */

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/search';
const MIN_INTERVAL_MS = 1100;

let lastRequestAt = 0;
const queue = [];
let processing = false;

function enqueue(task) {
  return new Promise((resolve, reject) => {
    queue.push({ task, resolve, reject });
    pumpQueue();
  });
}

async function pumpQueue() {
  if (processing || !queue.length) return;
  processing = true;
  while (queue.length) {
    const wait = Math.max(0, MIN_INTERVAL_MS - (Date.now() - lastRequestAt));
    if (wait) await new Promise((r) => setTimeout(r, wait));
    const { task, resolve, reject } = queue.shift();
    lastRequestAt = Date.now();
    try {
      resolve(await task());
    } catch (e) {
      reject(e);
    }
  }
  processing = false;
}

async function nominatimSearch(query, limit = 5) {
  const url = `${NOMINATIM_BASE}?format=json&countrycodes=ch&addressdetails=1&limit=${limit}&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: { 'Accept-Language': 'en', 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`Geocoding failed (${res.status})`);
  return res.json();
}

function parseNominatimResult(best) {
  const addr = best.address || {};
  const gemeinde = addr.municipality || addr.city || addr.town ||
    addr.village || addr.hamlet || addr.suburb || addr.county;
  const canton = addr.state;
  return {
    gemeinde,
    canton,
    lat: parseFloat(best.lat),
    lon: parseFloat(best.lon),
    displayName: best.display_name,
    raw: best,
  };
}

async function resolveAddress(address) {
  return enqueue(async () => {
    const results = await nominatimSearch(address, 5);
    if (!results.length) {
      const err = new Error('Address not found in Switzerland. Please enter a Swiss address.');
      err.code = 'NOT_FOUND';
      throw err;
    }
    const parsed = parseNominatimResult(results[0]);
    if (!parsed.gemeinde) {
      const err = new Error('Could not determine Gemeinde from address.');
      err.code = 'NO_GEMEINDE';
      throw err;
    }
    return { ...parsed, alternatives: results.slice(1).map(parseNominatimResult) };
  });
}

async function autocompleteAddress(query) {
  if (!query || query.length < 3) return [];
  return enqueue(() => nominatimSearch(query, 6));
}

window.SwissTaxGeocode = {
  resolveAddress,
  autocompleteAddress,
  parseNominatimResult,
  nominatimSearch: (q, l) => enqueue(() => nominatimSearch(q, l)),
};
