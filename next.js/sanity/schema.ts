import { SchemaTypeDefinition } from "sanity";
import { schemaTypes } from "./schemas";

export const PREVIEWABLE_DOCUMENT_TYPES: string[] = schemaTypes.map(
  (schema) => schema.name
);

export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
};
