import type { IFieldOptions } from 'contentful-migration';
type FieldType = IFieldOptions['type'];

declare module "./current-schema.json" {
  export = ContentfulSchema
}

interface SpaceLink {
  sys: {
    type: 'Link';
    linkType: 'Space';
    id: string;
  };
}

interface EnvironmentLink {
  sys: {
    type: 'Link';
    linkType: 'Environment';
    id: string;
    uuid?: string;
  };
}

interface UserLink {
  sys: {
    type: 'Link';
    linkType: 'User';
    id: string;
  };
}

interface ContentTypeSys {
    space: SpaceLink;
    id: string;
    type: 'ContentType';
    createdAt: string;
    updatedAt: string;
    environment: EnvironmentLink;
    publishedVersion: number;
    publishedAt: string;
    firstPublishedAt: string;
    createdBy: UserLink;
    updatedBy: UserLink;
    publishedCounter: number;
    version: number;
    publishedBy: UserLink;
}

type Validation =
  | { linkMimetypeGroup: string[], message?: string }
  | { unique: true, message?: string }
  | { enabledNodeTypes: string[], message?: string }
  | { enabledMarks: string[], message?: string }
  | { nodes: any, message?: string }
  | { in: string[] | number[], message?: string }
  | { linkContentType: string[], message?: string }
  | { size: { max?: number; min?: number }, message?: string }
  | { range: { max?: number; min?: number }, message?: string }
  | { regexp: { pattern: string, flags?: string }, message?: string }
  | { dateRange: { min?: string, max?: string }, message?: string }
  | {
    assetImageDimensions: {
      width: { min?: number; max?: number }
      height: { min?: number; max?: number }
    }, message?: string }
  | { assetFileSize: { max?: number; min?: number }, message?: string };

export interface Field {
  id: string;
  name: string;
  type: FieldType;
  localized: boolean;
  required: boolean;
  validations: Validation[];
  disabled: boolean;
  omitted: boolean;
  linkType?: 'Asset' | 'Entry';
  items?: Field;
  defaultValue?: { [locale: string]: any };
}

export interface ContentType {
  sys: ContentTypeSys;
  displayField: string;
  name: string;
  description: string;
  fields: Field[];
}

interface ContentTypeLink {
  sys: {
    id: string;
    type: 'Link';
    linkType: 'ContentType';
  }
}

export interface EditorInterfaceSys {
  id: string;
  type: 'EditorInterface';
  space: SpaceLink;
  version: number;
  createdAt: string;
  createdBy: UserLink;
  updatedAt: string;
  updatedBy: UserLink;
  contentType: ContentTypeLink;
  environment: EnvironmentLink;
}

export interface Control {
  fieldId: string;
  widgetId: string;
  widgetNamespace: 'builtin' | 'extension' | 'app';
}

export interface Editor {
  disabled: boolean;
  widgetId: string;
  widgetNamespace: string;
}

export interface EditorInterface {
  sys: EditorInterfaceSys;
  controls: Control[];
  editors: Editor[];
}

export interface LocaleSys {
  type: 'Locale';
  id: string;
  version: number;
  space: SpaceLink;
  environment: EnvironmentLink;
  createdBy: UserLink;
  createdAt: string;
  updatedBy: UserLink;
  updatedAt: string;
}

export interface Locale {
  name: string;
  code: string;
  fallbackCode?: any;
  default: boolean;
  contentManagementApi: boolean;
  contentDeliveryApi: boolean;
  optional: boolean;
  sys: LocaleSys;
}

export interface ContentfulSchema {
  contentTypes: ContentType[];
  tags: any[];
  editorInterfaces: EditorInterface[];
  locales: Locale[];
}
