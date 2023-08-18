# Kontent.ai

DEPT DASH™ stacks have an optional integration with [Kontent.ai](https://kontent.ai/), a full-featured headless CMS.

Check out the [make it your own](./customizing-kontent.ai.md) documentation to learn how to customize Kontent.ai for your project.

## Vocabulary

- _Environments_ are akin to deployed stages of your application. There’s one Production environment by default. You probably want another environment for each deployed stage (`dev`, `staging`, etc). Each environment acts like an independent project, with a different project id and API key. You may want to think about a way to manage these keys in your application - we've only included a single environment in this stack.
- _Content model_. Think of this like a db schema for the stuff you’re storing in Kontent.ai. What fields are available, which are required, etc.
- An _WorkFlow Step_ is the saved or published status of your content. You can schedule publishing or create drafts of content in Kontent.ai.
