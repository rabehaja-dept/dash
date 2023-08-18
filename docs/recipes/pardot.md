# Pardot

## Forms

Embedding a Pardot form is as simple as copying and pasting their iframe embed code ([reference](https://help.salesforce.com/s/articleView?id=sf.pardot_forms_deploying_forms.htm&type=5)). Example:

```
<div className="mt-6 flex h-full w-full p-[30px] lg:w-1/2">
  <iframe
    title="Contact Form"
    src="<pardotsrc>"
    width="100%"
    height="700px"
    id="pardot-form"
  ></iframe>
</div>
```
