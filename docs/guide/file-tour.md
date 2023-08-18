## A tour of important files

### `app/root.tsx`

The default export in this file is the top-level React component for your application. Any matching routes will land in the `<Outlet/>`, so you can add a header and footer above and below that if you want them on every page.

If there's any data you'll need to fetch on every page, you can put it in the loader function in this file.

### `routes`

The routes directory has a file for each route in your app. Try adding `routes/veggies.tsx` and export a component listing some of your favorite veggies:

```tsx
export default function Veggies() {
  return (
    <div className="mx-auto">
      <h1 className="font-bold">My favorite Veggies</h1>
      <ul>
        <li>Broccoli</li>
        <li>Brussels Sprouts</li>
        <li>Carrot</li>
      </ul>
    </div>
  );
}
```

Visit http://localhost:3000/veggies to see your glorious handiwork.
