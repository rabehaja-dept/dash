# Contentstack

DEPT DASH™ stacks have an optional integration with [Contentstack](https://https://www.contentstack.com/), a full-featured headless CMS.

Check out the [make it your own](./customizing-contentstack.md) documentation to learn how to customize it for your project. Before customizing your stack, you'll need to [move to your own Contentstack project](./moving-to-your-own-project.md).

## Vocabulary

- _Stack_ A stack is a container that holds all the content (entries) and assets related to a site. It also serves as a collaboration space where multiple users can work together to create, edit, approve, and publish content.
- _Entry_ An entry is an actual piece of content that you want to publish. You can create entries only for content types that have already been created.
- _Content type_ A content type lets you define the structure or blueprint of a page or a section of your web or mobile property. Content type consists of fields which are the building blocks for structured content. Using content types, you can create content of the same nature and pattern. Common examples of a content type are landing pages or blogs.
- _Asset_ An asset is a file that you upload to your stack. Assets can be images, videos, PDFs, and other files. You can use assets in your entries to add images, videos, and other files to your content.
- _Environments_ A publishing environment can be defined as one or more content delivery destination (app/website) where the content needs to be published. For example, you can have two servers of a website namely `development` and `production`. If you want to preview your content on your development server before publishing it on production, you can make two environments. Then, you can publish your content only on the development server. After the content looks correct on the development server, you can publish it on the production server.The most common publishing environments used are `development`, `staging`, and `production`.
- _Tokens_ A token let you authorize API calls. There are two types of tokens, `Management Token` (used to manage your stack) and `Delivery Token` (used to fetch content from your stack). You can create multiple tokens for each environment.
