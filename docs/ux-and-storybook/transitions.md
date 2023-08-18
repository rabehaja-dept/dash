## Transitions

Transitions are an important part of any good user experience. They help to create a sense of continuity and flow between different parts of the application. They can also help to create a sense of hierarchy and importance between different elements on the page.

For transitions, we like to use the [Framer Motion](https://www.framer.com/motion/) library. It's a great library that provides a lot of flexibility and control over transitions. It's also very well documented and has a great community around it.

### Transitioning between pages

The most common use of transitions is to animate between different pages. This is done by wrapping the page component in a `motion.[your own element name]` component. This component will animate in and out when the page changes.

We've created a `Transitions` component that wraps a `motion.main` component and provides a default fade transition. We've wrapped this component around the root `<Outlet />` in `root.tsx`, but it can be modified to wrap any page component. It's located in `app/transitions.tsx`.
