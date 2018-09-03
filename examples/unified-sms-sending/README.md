# Unified SMS Sending example

This is an example that shows how you can use the [CloudRail Unified SMS Sending API](https://cloudrail.com/integrations/interfaces/SMS;platformId=Nodejs) to integrate different SMS Sending services with the same code.

## Prerequisites

You need to have node.js installed ([get it from here](http://nodejs.org/)) and need to have developer credentials for the services you want to use. Instructions on how they can be acquired can be found on our [Unified SMS Sending API site](https://cloudrail.com/integrations/interfaces/SMS;platformId=Nodejs;serviceIds=Nexmo%2CTwilio%2CTwizo). You also need a CloudRail API key that you can [get here](https://cloudrail.com/signup).

Install the cloudrail-si node.js SDK by navigating to the project folder in a terminal and executing the command

```
npm install --save cloudrail-si
```

Find the following piece of code in your *index.js* file and enter your developer credentials and your CloudRail key. If you do not want to use a specific service, you can comment it out.

```javascript
cloudrail.Settings.setKey("[Your CloudRail Key]");

const nexmo = new cloudrail.services.Nexmo(null, "[Nexmo API Key]","[Nexmo API Secret]");
const twilio = new cloudrail.services.Twilio(null, "[Twilio Account SID]", "[Twilio Auth Token]");
const twizo = new cloudrail.services.Twizo(null, "[Twizo Key]");

sendSms(nexmo, "nexmo");
sendSms(twilio, "twilio");
sendSms(twizo, "twizo");
```

## Using the program

Call the program with the sending phone number or sender name as first argument and the receiving phone number as second. The program will then send a SMS from each service. Note that the different services might expect different phone formats and that not all of them allow you to enter a name as sender. Also, if you want to use Twilio, you have to use a sending phone number that was provided to you by them.