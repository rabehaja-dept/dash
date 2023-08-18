export type SanityProductPage = {
  _id: string;
  available: boolean;
  body: Block[];
  gid: string;
  slug?: string;
  seo: SanitySeo;
};

export interface Block<TChild = Span> {
  _type: string;
  _key: string;
  style: string;
  children: TChild[];
  markDefs: MarkDefinition[];
}

export interface Span {
  _type: "span";
  _key: string;
  marks: string[];
  text: string;
}

export interface MarkDefinition {
  [key: string]: unknown;
  _type: string;
  _key: string;
}

export type SanitySeo = {
  description?: string;
  image?: SanityAssetImage;
  title: string;
};

export interface SanityAssetImage extends Image {
  _type: "image";
  altText?: string;
  blurDataURL: string;
  height: number;
  url: string;
  width: number;
}

export interface Image {
  [key: string]: unknown; // We allow meta-fields on image
  asset: Reference;
  crop?: ImageCrop;
  hotspot?: ImageHotspot;
}

export interface Reference {
  _type: string;
  _ref: string;
  _key?: string;
  _weak?: boolean;
  _strengthenOnPublish?: {
    type: string;
    weak?: boolean;
    template?: {
      id: string;
      params: Record<string, string | number | boolean>;
    };
  };
}
export interface ImageHotspot {
  _type?: "sanity.imageHotspot";
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface ImageCrop {
  _type?: "sanity.imageCrop";
  left: number;
  bottom: number;
  right: number;
  top: number;
}

export interface Block<TChild = Span> {
  _type: string;
  _key: string;
  style: string;
  children: TChild[];
  markDefs: MarkDefinition[];
}

export type SanityModuleProducts = {
  _key?: string;
  _type: "module.products";
  layout?: "card" | "pill";
  modules: SanityModuleProduct[];
};

export type SanityModuleProduct = {
  _key?: string;
  _type: "module.product";
  productWithVariant: SanityProductWithVariant;
};

export type SanityProductWithVariant = {
  _id: string;
  _key?: string;
  _type: "productWithVariant";
  available: boolean;
  gid: string;
  slug?: string;
  variantGid: string;
};

export type SanityProducts = SanityDocument[];

export type SanityDocument = {
  body?: Block[];
  store?: Store;
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  variants: VariantDefered[];
};

export type Store = {
  createdAt: string;
  descriptionHtml: string;
  gid: string;
  isDeleted: boolean;
  options: StoreOptions[];
  previewImageUrl: string;
  priceRange: PriceRange;
  productType: string;
  slug: Slug;
  status: string;
  tags: string[];
  title: string;
  variants: VariantDefered[];
  vendor: string;
};

export type VariantDefered = {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  store: VariantStore;
};

export type VariantStore = {
  createdAt: string;
  compareAtPrice: number;
  gid: string;
  id: string;
  inventory: Inventory;
  isDeleted: boolean;
  option1: string;
  option2: string;
  option3: string;
  price: number;
  sku: string;
  title: string;
  status: string;
  productGid: string;
  productId: number;
};

export interface Inventory {
  isAvailable: boolean;
  management: string;
  policy: string;
}

export interface StoreOptions {
  _key: string;
  _type: string;
  name: string;
  values: string[];
}

export interface PriceRange {
  maxVariantPrice: number;
  minVariantPrice: number;
}

export interface Slug {
  _type: string;
  current: string;
}

export interface Variant {
  _key: string;
  _ref: string;
  _type: string;
  _weak: boolean;
}
