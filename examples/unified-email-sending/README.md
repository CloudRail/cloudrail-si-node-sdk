# Unified Email Sending example

This is an example that shows how you can use the [CloudRail Unified Email Sending API](https://cloudrail.com/integrations/interfaces/Email;platformId=Nodejs) to integrate different Email Sending services with the same code.

## Prerequisites

You need to have node.js installed ([get it from here](http://nodejs.org/)) and need to have developer credentials for the services you want to use. Instructions on how they can be acquired can be found on our [Unified Email Sending API site](https://cloudrail.com/integrations/interfaces/Email;platformId=Nodejs). You also need a CloudRail API key that you can [get here](https://cloudrail.com/signup).

Install the cloudrail-si node.js SDK by navigating to the project folder in a terminal and executing the command

```
npm install --save cloudrail-si
```

Find the following piece of code in your *index.js* file and enter your developer credentials and your CloudRail key.

```javascript
cloudrail.Settings.setKey("[Your CloudRail Key]");

var mailjet  = new cloudrail.services.MailJet(null, "[Mailjet API Key]", "[Mailjet API Private Key]");
var sendgrid = new cloudrail.services.SendGrid(null, "[SendGrid API Key]");
```

## Using the program

Call the program with the sending email adress as first and the receiving email adress as second parameter. The program will then send an email from each service. Note that when using MailJet, you can only use sender adresses that have been validated by MailJet.