const STRAPI_BASE_URL = process.env.STRAPI_BASE_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

function buildHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (STRAPI_API_TOKEN) headers.Authorization = `Bearer ${STRAPI_API_TOKEN}`;
  return headers;
}

async function fetchFromStrapi(path, queryString = '') {
  const url = `${STRAPI_BASE_URL}${path}${queryString ? `?${queryString}` : ''}`;
  const res = await fetch(url, { headers: buildHeaders() });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(`Strapi request failed: ${res.status} ${res.statusText}`);
    err.status = res.status;
    err.details = text;
    throw err;
  }
  return res.json();
}

export async function fetchProductsList(queryString = '') {
  return fetchFromStrapi('/api/products', queryString);
}

export async function fetchProductById(id, queryString = '') {
  return fetchFromStrapi(`/api/products/${encodeURIComponent(String(id))}`, queryString);
}

export async function fetchProductBySlug(slug, extraQueryString = '') {
  const baseParams = new URLSearchParams();
  baseParams.set('filters[slug][$eq]', String(slug));
  // Allow caller to pass through additional query params like populate, fields, etc.
  if (extraQueryString) {
    const extra = new URLSearchParams(extraQueryString);
    for (const [key, value] of extra.entries()) {
      // Do not override the slug filter
      if (key !== 'filters[slug][$eq]') baseParams.append(key, value);
    }
  }
  return fetchFromStrapi('/api/products', baseParams.toString());
}


