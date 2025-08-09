# ecommerce_hcl_hackathon

## Products (Strapi CMS)

- Added a minimal `simple-product` collection type in `cms/src/api/simple-product/...` and an `seo.meta` component in `cms/src/components/seo/meta.json`. The product uses a custom `catalogStatus` field to avoid conflicts with Strapi's internal publish status.
- Development-only seed runs from `cms/src/index.ts` and inserts 3 products if none exist. It is skipped when `NODE_ENV=production`.
- API examples: see `cms/docs/products.api.md` and REST Client requests in `cms/requests/products.http`.

Run CMS locally

```
cd cms
npm run develop
```

Permissions

- In the Strapi Admin, if you want unauthenticated reads, enable Public role permissions for `simple-product` find and findOne.