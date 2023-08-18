## Migrating to your own Kontent.ai project

The stack is initialized with access to a demo Kontent.ai project. This keeps the code from crashing when you first `npm run dev`, and reduces the number of things you have to set up immediately.

Eventually, you'll want to start using your own Kontent.ai project. That means you'll need to switch over to a new project that you or your client controls.

### Creating a new project

To create a new project, you'll need to [sign up for Kontent.ai](https://kontent.ai/signup). Once you've signed up, you can create a new project by clicking the `CREATE NEW PROJECT` at https://app.kontent.ai/projects/ .

### Migrating your content

Once you've created a new project, you may want to migrate your content from the demo project to your new project so you have a head start and your app doesn't immediately break locally.

To do so:

First, update all of the Kontent.ai environment variables in your `.envrc` file to point to your new project. You'll need to update the following variables:

```sh
KONTENT_AI_PROJECT_ID
KONTENT_AI_DELIVERY_API_KEY
KONTENT_AI_PREVIEW_API_KEY
KONTENT_AI_MANAGEMENT_API_KEY
```

Then, navigate to the [`Latest Release`](https://github.com/deptagency/dash/releases/latest) of DEPT DASH™ and download `kontent.ai-export.zip`. Copy the contents of the zip file into the `kontent.ai` directory of your project.

Finally, while still inside the `kontent.ai/` directory, run `npm run import-project` to upload the demo project's models and content to your new project.

You'll now be able to manage your new project in the Kontent.ai dashboard!
