# Sendgrid

DASH's [SendGrid](https://sendgrid.com/) implementation provides a cloud-based email delivery and management platform to send and manage email communications. Sendgrid has it's own web-based platform, which lets you manage your email communications. You can find more information about it here: <https://sendgrid.com/solutions/email-api/>.

## Moving to your own Sendgrid instance

Set up your own Sendgrid service (or existing one) and create a new API Key at `https://app.sendgrid.com/guide/integrate`.

Add that value to the Github repo secrets and your local `.envrc` file as `SENDGRID_API_KEY`.

Set the environment variable `SENDGRID_FROM_ADDRESS` to the email address you want to send emails from.

You may have to configure your Sendgrid account to allow sending emails from your domain. You can find more information about this here: <https://sendgrid.com/docs/ui/account-and-settings/how-to-set-up-domain-authentication/>.

For example, some domains require adding `CNAME` records to your DNS settings. You can find more information about this here: <https://sendgrid.com/docs/ui/account-and-settings/how-to-set-up-domain-authentication/#step-1-add-cname-records-to-your-dns-settings>.

## Altering templates

DASH comes with a default email template for order confirmations and user registration emails. You can find the template in the `stack/app/sendgrid/templates` folder. You can alter this template to your liking. The template comes with a variable title, text and call to action for which the values you can pass to the `sendEmail` function. Alternatively, you can pass your own HTML content to the `sendEmail` function via the optional `html` parameter.
