// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap: async ({ strapi } /*: { strapi: Core.Strapi }*/) => {
    // Development-only seed for simple products when no records exist
    if (process.env.NODE_ENV !== 'production') {
      try {
        const count = await strapi.entityService.count('api::simple-product.simple-product');
        if (count === 0) {
          await strapi.entityService.create('api::simple-product.simple-product', {
            data: {
              title: 'Cotton T-Shirt',
              productType: 'physical',
              sku: 'TSHIRT-001',
              description: '<p>Soft 100% cotton tee.</p>',
              price: 799,
              currency: 'INR',
              inventory: 25,
              requiresShipping: true,
              catalogStatus: 'active',
              tags: ['tshirt', 'cotton'],
              seo: { title: 'Cotton T-Shirt', description: 'Classic cotton tee' },
              meta: { material: '100% cotton' },
              publishedAt: new Date().toISOString()
            },
          });
          await strapi.entityService.create('api::simple-product.simple-product', {
            data: {
              title: 'Digital Lightroom Preset Pack',
              productType: 'digital',
              sku: 'DL-PRESET-01',
              description: '<p>Preset pack for photographers.</p>',
              price: 999,
              currency: 'INR',
              requiresShipping: false,
              catalogStatus: 'active',
              tags: ['digital', 'preset'],
              publishedAt: new Date().toISOString()
            },
          });
          await strapi.entityService.create('api::simple-product.simple-product', {
            data: {
              title: 'Home Cleaning Service',
              productType: 'service',
              sku: 'SERV-CLN-2H',
              description: '<p>Two-hour basic cleaning service.</p>',
              price: 1499,
              currency: 'INR',
              requiresShipping: false,
              catalogStatus: 'active',
              tags: ['service', 'home'],
              publishedAt: new Date().toISOString()
            },
          });
          strapi.log.info('Seeded initial simple products.');
        }
      } catch (e: any) {
        strapi.log.warn('Simple Product seed skipped: ' + e.message);
      }
    }
  },
};
