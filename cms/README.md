# 🚀 Getting started with Strapi

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/dev-docs/cli) (CLI) which lets you scaffold and manage your project in seconds.

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-develop)

```
npm run develop
# or
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
# or
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
# or
yarn build
```

## ⚙️ Deployment

Strapi gives you many possible deployment options for your project including [Strapi Cloud](https://cloud.strapi.io). Browse the [deployment section of the documentation](https://docs.strapi.io/dev-docs/deployment) to find the best solution for your use case.

```
yarn strapi deploy
```

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>

### Products

- A minimal product content type has been added as `simple-product` (existing `product` type was present). It includes fields: `title`, `slug`, `productType`, `sku`, `barcode`, `description`, `price`, `currency`, `compareAt`, media `images`/`thumbnail`, inventory fields, dimensions, `catalogStatus`, `tags`, `seo` (component), and `meta`.
- SEO component `seo.meta` lives at `src/components/seo/meta.json` with `title`, `description`, `keywords`, `canonicalUrl`, and `ogImage`.

Run locally

```
npm run develop
# or
yarn develop
```

Seeding

- Development-only seed runs in `src/index.ts` bootstrap. If no `simple-product` entries exist, three examples are created. It will not run in production.

REST testing

- See `docs/products.api.md` and `requests/products.http` for examples.
- Reminder: set Public role read permissions for `simple-product` if you want unauthenticated GETs, otherwise use an API token/server-to-server.

Strapi Cloud note

- If your cloud environment does not execute bootstrap in production, run a one-time local seed by starting the app locally and/or creating products via the provided requests.
