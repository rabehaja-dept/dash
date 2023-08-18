## Adding components

You'll likely want to add more Contentful-driven components during the course of a project, such as different feature blocks. There are a few steps to take to accomplish this:

1. [Add the content type](#add-the-content-type) in Contentful. See [moving to your own Space](./moving-to-your-own-space.md) for more details on Contentful schema changes and migrations.
2. Refresh your local Typescript types. This is done by running `npm run generate-typedefs` in the `contentful` directory (see [types](./types.md) for more details).
3. Add a new block to `richTextOptions` in `app/contentful/index.tsx` to handle rendering your new component. See below for more details.

### Add the content type 

1. Open up your Contentful space and go to `Content model`.
2. Click `Add content type` and follow the prompt.
3. Add fields for each thing end users will need to edit for your new component. Generally, these are either content you'll use directly (for example, a `Title` field that is displayed in a `Hero` component), or options to determine how the component renders (for example, a `Bottom Padding` field with options for `small` and `large` to determine how much padding should be under the `Hero`).
4. When you're done adding all the fields, click `Save` on the overall content type.

### Telling Contentful to render new embedded entries

We use a shared `richTextOptions` variable in `app/contentful/index.tsx` to control how rich text content from Contentful is rendered. In other words, when a user creates a new Page or Post in Contentful with content in the rich text `Body` field, the `richTextOptions` variable controls how that content is rendered.

If you look at the existing value of `richTextOptions`, you'll see a variety of entries for basic markup like `BLOCKS.HEADING_1` as well as a larger `BLOCKS.EMBEDDED_ENTRY` block. Inside the `BLOCKS.EMBEDDED_ENTRY` block, it handles rendering each known component, then asserts unreachable if it encounters a new, unknown component. If you follow items 1 and 2 above (adding a new content type and refreshing your local Typescript types), then you should get Typescript errors from this section complaining about a new unhandled type. In order to handle your new component type, add a section to the if statement like this:

```typescript
} else if (contentType === "newComponent") {
  // This object holds all the values from the Contentful content type
  const fields = node.data.target
    .fields as SpecificLocaleFields<INewComponentFields>;
  // Return TSX to render for this Contentful content type. This is usually at least the corresponding component (<NewComponent> in this case), but can also have other markup as needed (such as an <Inset> wrapper).
  return (
    <NewComponent
      // Component props, usually filled in from the fields object
      // Example: title={fields.title}
    />
  );
}
```

This will then be used to render that embedded entry type whenever it appears in rich text content. You can test it by editing one of your pages in Contentful (like `Home` or `About Us`) and temporarily adding your new content type as an embedded entry in the `Body` field. Once you publish that change, you should see your new React component rendered on that page.

[![Adding a new content type](./images/adding-a-new-content-type.png)](https://dept-dash-demo-videos.s3.us-east-1.amazonaws.com/Adding%20a%20Contentful%20Content%20Type.mp4)
