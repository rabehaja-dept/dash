# Internationalization

You can create, manage and distribute localized content in different languages, called "locales".

## Configuration

To configure a new locale, you need to add a new entry on supported languages in [stack/app/i18n-config.ts](../../stack/app/i18n-config.ts) file with its code and name and you will need to add the same locale on the Strapi admin panel.

### Enable localization for a Content-Type

**You need to run Strapi with the auto-reload feature.**

You won't be able to do that in production. In order to configure your Content Type with localization you need to start Strapi with the following command on the `/strapi` directory.

```
npm run develop
```

Then access to `STRAPI_URL/admin` (usually `localhost:1337/admin`). 
To enable localization for a Content-Type: 
1. Go to the Content-Type Builder 
2. Select the Content Type you want to enable localization.
3. Click on the `Edit` button, and on the `Advanced Settings` tab.
4. Then you will see the `Settings` section with a checkbox called `Enable localization for this Content-Type`.

![Enable localization for a Content Type](https://dept-dash-demo-videos.s3.amazonaws.com/Internationalization.png)

### Strapi admin panel setting

**You don't need the auto-reload feature**

To configure a new locale you will need to go to the Strapi admin panel and add a new locale in the settings section.
The locale's content will be the same as the one in the [stack/app/i18n-config.ts](../../stack/app/i18n-config.ts) file.

### i18n configuration

The i18n configuration is located in the [stack/app/i18n-config.ts](../../stack/app/i18n-config.ts) file. Adding a new local in the Strapi admin setting panes will not be enough to make it work. You will need to add the locale in the [stack/app/i18n-config.ts](../../stack/app/i18n-config.ts) file too.

### Example

Imagine that in your Strapi admin settings, the Internationalization section you have the following locales:
```js
ID | DISPLAY NAME                  |    DEFAULT LOCALE
1  | English (en)	                 |    Default	
2  | Spanish (Argentina) (es-ar)	 |	
3  | Spanish (es)	                 |
```
In the [stack/app/i18n-config.ts](../../stack/app/i18n-config.ts) file you will need to add the following locales:
```js
export const supportedLanguages = [
  { code: "en-US", name: "English (US)" },
  { code: "nl-NL", name: "Nederlands" },
  { code: "es-ar", name: "Español (Argentina)" },
  { code: "es", name: "Español (España)" },
] as const;
```

The expected behavior will be that when you go to `https://example.com` it will use the default locale, when you go to `https://es.example.com` it will use the Spanish (España) locale and when you go to `https://es-ar.example.com` it will use the Spanish (Argentina) locale.
