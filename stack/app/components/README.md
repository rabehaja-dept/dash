# Components

This directory contains React components that are used in the application. Components are grouped by their purpose and are named in a way that makes it easy to find them.

When creating a new component, either add it to an existing directory or create a new one. Then, export the component from the `index.ts` file in the directory. This way, you can import the component from the directory instead of the file.

```ts
export * from "./MyComponent";
```

Likewise, if you create a new directory, make sure to add an `index.ts` file and export the components from it.
