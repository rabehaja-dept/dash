# Getting data from Sanity

You can customize your query to get the data you need from Sanity. You can find more information about the query language here: https://www.sanity.io/docs/how-queries-work. For this integration, we used the following query:

```groq
`*[_type == 'product' && store.slug.current == '${slug}'][0]`
```

For simplicity, the dataset that is configured for this project is public. If you want to use a private dataset, you'll need to add the token to the Authorization header in the api function in`/app/utils.ts`. You can find more information about this [here](https://www.sanity.io/docs/http-auth).

**store is the product data from Shopify (read-only)**

You can get the data from Shopify and then get the data from Sanity using the slug of the product.

## Block Content

Sanity is very flexible and can be used for many different purposes.
In this integration, we used Sanity to add some extra information to our products. This additional information is of a [block type](https://www.sanity/docs/block-type).
Showing this additional information on the product page is a great way to tell a story about your products and make them more appealing to your customers. For that we created the component [PortableText](/stack/app/sanity/components/PortableText.tsx) that shows some but not all of the possible features of the block type. You will need to customize the serializer or even add new ones to more features of the block type (Instagram, Images, Call to Action, etc).
