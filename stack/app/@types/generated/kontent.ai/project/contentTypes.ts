/**
 * Generated by '@kontent-ai/model-generator@5.8.0'
 *
 * Project name: Getting Started Project
 * Environment: DEPT DASH™ Demo
 * Project Id: 942b001e-ccf5-00e6-fb5f-846ef4abd692
 */
export const contentTypes = {
  /**
   * Article
   * Last modified: Thu Jan 19 2023 16:15:11 GMT-0500 (Eastern Standard Time)
   */
  article: {
    codename: 'article',
    id: 'c5837fd0-b1d8-4648-849c-ed87b77e5366',
    externalId: undefined,
    name: 'Article',
    elements: {
      /**
       * Body (rich_text)
       *
       * This is rich text field that you can use to add formatted text and compose larger content out of smaller pieces. You can also add images, links, and other content.
       */
      body: {
        codename: 'body',
        id: '0ae0b43c-ff05-4742-9aab-a8300b5ad458',
        externalId: undefined,
        name: 'Body',
        required: false,
        type: 'rich_text',
        snippetCodename: undefined,
      },

      /**
       * Thumbnail Image (asset)
       */
      thumbnail_image: {
        codename: 'thumbnail_image',
        id: 'e469e6ce-f090-432a-9735-041acd158359',
        externalId: undefined,
        name: 'Thumbnail Image',
        required: true,
        type: 'asset',
        snippetCodename: undefined,
      },

      /**
       * Title (text)
       *
       * This is a simple text field. It defines the title for your article (and can be different than the name in Kontent.ai). Text fields don't store any formatting.
       */
      title: {
        codename: 'title',
        id: '2fc470e5-0a22-464c-945f-e41ec54ccad6',
        externalId: undefined,
        name: 'Title',
        required: false,
        type: 'text',
        snippetCodename: undefined,
      },

      /**
       * URL (url_slug)
       *
       * This URL slug is automatically generated from the title. But you can also change it to be more SEO-friendly.
       */
      url: {
        codename: 'url',
        id: 'cd6e653f-11f8-4b70-8847-fac41736b67c',
        externalId: undefined,
        name: 'URL',
        required: true,
        type: 'url_slug',
        snippetCodename: undefined,
      },
    },
  },

  /**
   * Landing page
   * Last modified: Thu Jan 19 2023 16:15:21 GMT-0500 (Eastern Standard Time)
   */
  landing_page: {
    codename: 'landing_page',
    id: 'a79941be-a956-44cd-9575-e0e490f90b37',
    externalId: undefined,
    name: 'Landing page',
    elements: {
      /**
       * Body (rich_text)
       *
       * This is rich text field that you can use to add formatted text and compose larger content out of smaller pieces. You can also add images, links, and other content.
       */
      body: {
        codename: 'body',
        id: '15683698-1689-4f43-a964-de0fbe4da7ae',
        externalId: undefined,
        name: 'Body',
        required: false,
        type: 'rich_text',
        snippetCodename: undefined,
      },

      /**
       * Product list (modular_content)
       *
       * In this element, you can choose which products will be featured on this landing page.
       */
      product_list: {
        codename: 'product_list',
        id: 'b70c44a8-f595-437a-89da-bab97abb0352',
        externalId: undefined,
        name: 'Product list',
        required: true,
        type: 'modular_content',
        snippetCodename: undefined,
      },

      /**
       * Title (text)
       *
       * This is a simple text field. It defines the title for your landing page (and can be different than the name in Kontent.ai). Text fields don't store any formatting.
       */
      title: {
        codename: 'title',
        id: 'c4f0a7c8-aa32-4bd3-aaf1-5ae8b8c501c8',
        externalId: undefined,
        name: 'Title',
        required: false,
        type: 'text',
        snippetCodename: undefined,
      },

      /**
       * URL (url_slug)
       *
       * This URL slug is automatically generated from the title. But you can also change it to be more SEO-friendly.
       */
      url: {
        codename: 'url',
        id: 'c5d9800e-e419-4268-9e16-ae4753692496',
        externalId: undefined,
        name: 'URL',
        required: true,
        type: 'url_slug',
        snippetCodename: undefined,
      },
    },
  },

  /**
   * Product
   * Last modified: Thu Jan 19 2023 16:15:01 GMT-0500 (Eastern Standard Time)
   */
  product: {
    codename: 'product',
    id: '2e1cd566-2883-4f45-b951-0d2f3c81eafc',
    externalId: undefined,
    name: 'Product',
    elements: {
      /**
       * Description (rich_text)
       *
       * This is rich text field that you can use to add formatted text and compose larger content out of smaller pieces. You can also add images, links, and other content. Here, you will add descriptions of your products.
       */
      description: {
        codename: 'description',
        id: '7aea9732-1502-4f5e-bc0f-258ffb10f78f',
        externalId: undefined,
        name: 'Description',
        required: false,
        type: 'rich_text',
        snippetCodename: undefined,
      },

      /**
       * Image (asset)
       *
       * You can include assets in your content as separate pieces that you can display as you wish. You can also specify the size and kind of asset you want to help make your content responsive.
       */
      image: {
        codename: 'image',
        id: 'caef6e8f-0bd1-4535-ac99-36cf5db2dc24',
        externalId: undefined,
        name: 'Image',
        required: true,
        type: 'asset',
        snippetCodename: undefined,
      },

      /**
       * Name (text)
       *
       * This is a simple text field. It defines the name of your product (and can be different than the name of the content item in Kontent.ai). Text fields don't store any formatting.
       */
      name: {
        codename: 'name',
        id: '9bc8b648-1bd9-4fa4-8c12-822cba3fd4a4',
        externalId: undefined,
        name: 'Name',
        required: false,
        type: 'text',
        snippetCodename: undefined,
      },

      /**
       * URL (url_slug)
       *
       * This URL slug is automatically generated from the name. But you can also change it to be more SEO-friendly.
       */
      url: {
        codename: 'url',
        id: '6a29a2bf-5a85-423d-a137-39bbe7efc315',
        externalId: undefined,
        name: 'URL',
        required: true,
        type: 'url_slug',
        snippetCodename: undefined,
      },
    },
  },
} as const;
