import { BrowserRouter } from "react-router-dom";
// Import all of our CSS generated from Tailwind CLI
// `npm run storybook` runs `npm run dev:css` alongside running storybook, so this will always be present
import "../app/tailwind/tailwind.css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

// Wrap all stories in a Router so that Link works
export const decorators = [
  (Story) => (
    <BrowserRouter>
      <Story />
    </BrowserRouter>
  ),
];
