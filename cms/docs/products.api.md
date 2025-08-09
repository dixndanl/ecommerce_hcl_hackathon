### Product API examples

Note: This project includes a collection type named `simple-product` because an existing `product` type already exists in this repo. Endpoints are therefore `/api/simple-products`.

- Base URL: `http://localhost:1337`
- Auth: Use an API token or enable Public role permissions for `simple-product` read if appropriate.

POST /api/simple-products

```
curl -X POST http://localhost:1337/api/simple-products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d '{
    "data": {
      "title": "Cotton T-Shirt",
      "productType": "physical",
      "sku": "TSHIRT-002",
      "price": 899,
      "currency": "INR",
      "status": "active",
      "seo": {"title": "Cotton T-Shirt", "description": "Classic cotton tee"}
    }
  }'
```

GET /api/simple-products with filters, pagination, sort, and populate

```
curl "http://localhost:1337/api/simple-products?filters[status][$eq]=active&pagination[page]=1&pagination[pageSize]=24&sort=title:asc&populate=images,thumbnail"
```

GET /api/simple-products/:id and by slug

```
curl http://localhost:1337/api/simple-products/1
curl "http://localhost:1337/api/simple-products?filters[slug][$eq]=cotton-t-shirt"
```

PUT /api/simple-products/:id (minimal update)

```
curl -X PUT http://localhost:1337/api/simple-products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d '{"data": {"price": 999}}'
```


