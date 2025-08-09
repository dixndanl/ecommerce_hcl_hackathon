### Product API examples

Note: The collection type is now `product`. Endpoints are `/api/products`.

- Base URL: `http://localhost:1337`
- Auth: Use an API token or enable Public role permissions for `simple-product` read if appropriate.

POST /api/products

```
curl -X POST http://localhost:1337/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d '{
    "data": {
      "title": "Cotton T-Shirt",
      "productType": "physical",
      "sku": "TSHIRT-002",
      "price": 899,
      "currency": "INR",
      "catalogStatus": "active",
      "seo": {"title": "Cotton T-Shirt", "description": "Classic cotton tee"}
    }
  }'
```

GET /api/products with filters, pagination, sort, and populate

```
curl "http://localhost:1337/api/products?filters[catalogStatus][$eq]=active&pagination[page]=1&pagination[pageSize]=24&sort=title:asc&populate=images,thumbnail"
```

GET /api/products/:id and by slug

```
curl http://localhost:1337/api/products/1
curl "http://localhost:1337/api/products?filters[slug][$eq]=cotton-t-shirt"
```

PUT /api/products/:id (minimal update)

```
curl -X PUT http://localhost:1337/api/products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d '{"data": {"price": 999}}'
```


