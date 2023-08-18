# Development workflow

1. The design team will use the provided Figma file as a starting point to design the project.
2. The development team will implement each component using Storybook.
3. The development team will model out the content type for each component in some CMS.
4. The development team will wire up the CMS content type to React components.
5. The team will test that it all works from start to finish.

**You might use a different development workflow, we are just describing a common one**

## Design components

The design team will use the provided Figma file as a starting point to design the project. As they finish sections (and specifically components within those sections), the development team can begin implementing them. This part of the process generally works the same way it works for any project, aside from using the DEPT DASH™ Figma file as a starting point.

# Storybook

Many components include [Storybook](https://storybook.js.org/) stories for visual testing. These are located in `app/components/stories`. To run storybook, simply run `npm run storybook`. The storybook site will launch automatically.

**If you don't care about storybook, you can rip it out using `scripts/remove-storybook.sh`.**

## Implement components in Storybook

Once the design team has some components ready to implement, you'll first want to sketch them out using Storybook.

1. Run `npm run storybook` to start Storybook in your local DEPT DASH™ project (see [create a project](./create-a-project.md) if you still need to create a local project). Storybook will start running in your browser. Be ready to refer back to the running instance of Storybook in a bit.
2. Open the project in your code editor and navigate to `app/components`. This directory is where all the components in your project lives. You'll see a bunch of the out-of-the-box components there already which you can either use as an example or a starting point for your own modifications.
3. Create a new component in that directory. This works the same way it always does in a React project. Feel free to look at the existing components as an example.
4. Navigate to `app/components/stories`. This directory holds all the Storybook stories for each component. If you haven't used Storybook before, these essentially implement an example use of your component so that Storybook can render it. See the [Storybook documentation](https://storybook.js.org/docs/react/writing-stories/introduction) for more details.
5. Create a new story for your new component. Look at the existing stories for examples on how to implement it.
6. After you've made a new component and story, check your Storybook instance that you started in step 1. You should see the new component visually in Storybook. Storybook will hot reload as you continue to make changes.

That's the general workflow for creating and styling components. Work through at least one component using this process, then move on to the next step.

> We're using the example of creating a brand new component, but you can also choose an existing component to modify instead. This is likely a good idea for common components like `Hero`.

## Deploy your own Storybook instance

When you've made changes to the design system, you'll probably want to deploy your own Storybook instance so designers and/or clients can review individual components. We handle this differently depending on your deployment target.

For AWS & Fly.io:

- Storybook deployment is handled by generating the static files and serving them via express to `/_/storybook`. This can be changed by modifying `.storybook/main.js` and `server/server.ts`.

For Vercel:

- Vercel deploys Remix apps to the edge, so we can't use the same approach as AWS & Fly.io. If you'd like to deploy Storybook to Vercel, you'll need to add a separate Vercel project and deploy the static files to it. You can find instructions [here](https://vercel.com/guides/storybook-with-vercel).

### Visual regression testing with Percy

We've also made it easy to use [Percy](https://percy.io/) for visual regression testing. To start using Percy in your app:

1. Head over to percy.io, sign up, and copy your app token
2. Add the token value as `PERCY_TOKEN` in your Github Secrets
3. If you'd like to run Percy locally, also add this value to your `.envrc`

Once configured, on merges to main/production/staging/master, we send storybook snapshots to Percy for analysis.

[Learn more here.](https://docs.percy.io/docs/storybook)

[![Intro to design & Storybook](./images/intro-to-design-and-storybook.png)](https://dept-dash-demo-videos.s3.amazonaws.com/Intro+to+Design+and+Storybook.mp4)
