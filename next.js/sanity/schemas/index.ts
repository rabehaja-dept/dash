// Rich text annotations used in the block content editor
import annotationLinkEmail from "./annotations/linkEmail";
import annotationLinkExternal from "./annotations/linkExternal";
import annotationLinkInternal from "./annotations/linkInternal";
import annotationProduct from "./annotations/product";

const annotations = [
  annotationLinkEmail,
  annotationLinkExternal,
  annotationLinkInternal,
  annotationProduct,
];

// Document types
import collection from "./documents/collection";
import colorTheme from "./documents/colorTheme";
import page from "./documents/page";
import product from "./documents/product";
import productVariant from "./documents/productVariant";

const documents = [collection, colorTheme, page, product, productVariant];

// Singleton document types
import home from "./singletons/home";
import settings from "./singletons/settings";

const singletons = [home, settings];

// Block content
import body from "./blocks/body";

const blocks = [body];

// Object types
import customProductOptionColor from "./objects/customProductOption/color";
import customProductOptionSize from "./objects/customProductOption/size";
import linkExternal from "./objects/linkExternal";
import linkInternal from "./objects/linkInternal";
import heroCollection from "./objects/hero/collection";
import heroHome from "./objects/hero/home";
import heroPage from "./objects/hero/page";
import moduleImage from "./objects/module/image";
import moduleImages from "./objects/module/images";
import placeholderString from "./objects/placeholderString";
import productOption from "./objects/productOption";
import productWithVariant from "./objects/productWithVariant";
import proxyString from "./objects/proxyString";
import seoHome from "./objects/seo/home";
import seoPage from "./objects/seo/page";
import seoShopify from "./objects/seo/shopify";
import shopifyCollection from "./objects/shopifyCollection";
import shopifyCollectionRule from "./objects/shopifyCollectionRule";
import shopifyProduct from "./objects/shopifyProduct";
import shopifyProductVariant from "./objects/shopifyProductVariant";

const objects = [
  customProductOptionColor,
  customProductOptionSize,
  linkExternal,
  linkInternal,
  heroCollection,
  heroHome,
  heroPage,
  moduleImage,
  moduleImages,
  placeholderString,
  productOption,
  productWithVariant,
  proxyString,
  seoHome,
  seoPage,
  seoShopify,
  shopifyCollection,
  shopifyCollectionRule,
  shopifyProduct,
  shopifyProductVariant,
];

export const schemaTypes = [
  ...annotations,
  ...documents,
  ...singletons,
  ...objects,
  ...blocks,
];
