import { type IContentItem, type Elements } from '@kontent-ai/delivery-sdk';
import { type Product } from './product';

/**
 * Generated by '@kontent-ai/model-generator@5.8.0'
 *
 * Landing page
 * Id: a79941be-a956-44cd-9575-e0e490f90b37
 * Codename: landing_page
 */
export type LandingPage = IContentItem<{
  /**
   * Body (rich_text)
   * Required: false
   * Id: 15683698-1689-4f43-a964-de0fbe4da7ae
   * Codename: body
   *
   * This is rich text field that you can use to add formatted text and compose larger content out of smaller pieces. You can also add images, links, and other content.
   */
  body: Elements.RichTextElement;

  /**
   * Product list (modular_content)
   * Required: true
   * Id: b70c44a8-f595-437a-89da-bab97abb0352
   * Codename: product_list
   *
   * In this element, you can choose which products will be featured on this landing page.
   */
  product_list: Elements.LinkedItemsElement<Product>;

  /**
   * Title (text)
   * Required: false
   * Id: c4f0a7c8-aa32-4bd3-aaf1-5ae8b8c501c8
   * Codename: title
   *
   * This is a simple text field. It defines the title for your landing page (and can be different than the name in Kontent.ai). Text fields don't store any formatting.
   */
  title: Elements.TextElement;

  /**
   * URL (url_slug)
   * Required: true
   * Id: c5d9800e-e419-4268-9e16-ae4753692496
   * Codename: url
   *
   * This URL slug is automatically generated from the title. But you can also change it to be more SEO-friendly.
   */
  url: Elements.UrlSlugElement;
}>;
