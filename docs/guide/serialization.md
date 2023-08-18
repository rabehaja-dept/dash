### Background

In Remix, when returning data from a `loader` function and using it in a route component via `useLoaderData`, the data is being serialized to JSON on the server and deserialized on the client. This is normal for any Javascript-based application (and for most web apps in general), but it means there's nuance when dealing with complex types.

For example, if you pass a Date object, it will become a string on the frontend instead of a Date object (the string's value will be an ISO date string). This same behavior applies in different ways to most non-primitive types in Javascript.

### How does this impact us?

If you set up and use a `LoaderData` interface similar to this, where Article includes complex types:

```
interface LoaderData {
  article: Article;
}
```

Then use it like this:

```
const { article } = useLoaderData<LoaderData>();
```

You'll likely start getting type errors in your route component similar to this:

```
(property) fields: SerializeObject<UndefinedToOptional<SpecificLocaleFields<IPostFields>>>
Argument of type 'SerializeDeferred<NodeData>' is not assignable to parameter of type 'Document'.
  Type 'SerializeDeferred<NodeData>' is missing the following properties from type 'Document': nodeType, content, data
```

This is because `article` in the route component is supposed to be an `Article`, but it's actually a serialized representation of `Article` which changes non-primitive types.

### How do we fix it?

We use the `remix-superjson` package when necessary to serialize complex types.

To use it, import these:

```
import { json as superjson } from "superjson-remix";
import { useLoaderData as useSuperjsonLoaderData } from "superjson-remix";
```

Then return from the `loader` function using the `superjson` function like this:

```
return superjson<LoaderData>({
  article,
});
```

And use it in your route component like this:

```
const { article } = useSuperjsonLoaderData<LoaderData>();
```
