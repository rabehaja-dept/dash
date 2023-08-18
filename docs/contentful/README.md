# Contentful

DEPT DASH™ stacks are set up to use contentful by default. It might take some getting used to, but clients love the friendly interface for updating content and data, and it has excellent support for localization.

If you prefer, you can [rip it out](./removing-contentful.md). If you're keeping it, you probably want to [make it your own](./moving-to-your-own-space.md).

## Vocabulary

- a _Space_ is what Contentful calls a project or property. Your stack starts out pointed at our Demo space, where you have read access but cannot make changes.
- _Environments_ are akin to deployed stages of your application. There’s one “master” environment, which is the only one actually cached. That's what we use for production. You probably want another environment for each deployed stage (`dev`, `staging`, etc). Each environment has independent data, including content models, but when you make a new one it always starts off with everything in "master". There is a limit of 3 environments for the free tier, and 5 for the "Team" tier.
- _Content model_. Think of this like a db schema for the stuff you’re storing in contentful. What fields are available, which are required, etc.
- An _Entity_ is a single instance of a contentful type. If Content Models are your db tables, Entities are your rows.
- _Editors_ are people who will be authoring and updating content in your space, generally not developers, and will not make changes to the content model.
- _Migrations_ are special scripts that describe how to change a content model. We use them when clicking around and making changes live would risk downtime or data loss. See [Why we need migrations](#why-we-need-migrations).
