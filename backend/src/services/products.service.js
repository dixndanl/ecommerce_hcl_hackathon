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

async function postToStrapi(path, body) {
  const url = `${STRAPI_BASE_URL}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(body)
  });
  const text = await res.text().catch(() => '');
  let json;
  try { json = text ? JSON.parse(text) : null; } catch (_) { json = null; }
  if (!res.ok) {
    const err = new Error(`Strapi request failed: ${res.status} ${res.statusText}`);
    err.status = res.status;
    err.details = json || text;
    throw err;
  }
  return json;
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

/**
 * Returns a JSON structure describing how to create a Product in Strapi.
 * Includes a ready-to-use request template and enumerations for select fields.
 */
export function getProductStructure() {
  const enums = {
    productType: ['physical', 'digital', 'service', 'bundle'],
    currency: ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD'],
    inventoryPolicy: ['deny', 'continue'],
    weightUnit: ['g', 'kg', 'lb'],
    dimensionUnit: ['mm', 'cm', 'in'],
    catalogStatus: ['draft', 'active', 'archived']
  };

  const required = ['title', 'productType', 'price', 'currency', 'catalogStatus'];

  const template = {
    data: {
      title: '',
      // slug is auto-generated from title by Strapi UID field
      productType: 'physical',
      sku: '',
      barcode: '',
      description: '',
      price: 0,
      currency: 'INR',
      compareAt: null,
      images: [], // media IDs array
      thumbnail: null, // single media ID
      inventory: 0,
      inventoryPolicy: 'deny',
      requiresShipping: true,
      weight: null,
      weightUnit: 'kg',
      length: null,
      width: null,
      height: null,
      dimensionUnit: 'cm',
      catalogStatus: 'draft',
      tags: [],
      seo: {
        title: '',
        description: '',
        keywords: '',
        canonicalUrl: '',
        ogImage: null // single media ID
      },
      meta: {}
    }
  };

  return { template, enums, required };
}

export async function createProduct(productData) {
  return postToStrapi('/api/products', { data: productData });
}

export async function createProductsBulk(products, options = {}) {
  const { continueOnError = true } = options;
  const results = [];
  let created = 0;
  let failed = 0;

  for (const product of products) {
    try {
      const data = await createProduct(product);
      results.push({ status: 'fulfilled', input: product, data });
      created += 1;
    } catch (err) {
      const errorPayload = {
        status: 'rejected',
        input: product,
        error: {
          message: err?.message || 'Unknown error',
          status: err?.status,
          details: err?.details
        }
      };
      results.push(errorPayload);
      failed += 1;
      if (!continueOnError) {
        return { summary: { total: products.length, created, failed }, results };
      }
    }
  }

  return { summary: { total: products.length, created, failed }, results };
}


