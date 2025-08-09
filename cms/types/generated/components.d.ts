import type { Schema, Struct } from '@strapi/strapi';

export interface SeoMeta extends Struct.ComponentSchema {
  collectionName: 'components_seo_meta';
  info: {
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    canonicalUrl: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    keywords: Schema.Attribute.String;
    ogImage: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'seo.meta': SeoMeta;
    }
  }
}
