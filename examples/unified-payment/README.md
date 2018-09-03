# Unified Payment example

This is a simple example that shows how you can easily access different payment services with node.js using the [CloudRail Unified Payment API](https://cloudrail.com/integrations/interfaces/Payment;platformId=Nodejs).

## Prerequisites

You need to have node.js installed ([get it from here](http://nodejs.org/)) and need to have developer credentials for the services you want to use. Instructions on how they can be acquired can be found on our [Unified Payment API site](https://cloudrail.com/integrations/interfaces/Payment;platformId=Nodejs). You also need a CloudRail API key that you can [get here](https://cloudrail.com/signup).

Install the cloudrail-si node.js SDK by navigating to the project folder in a terminal and executing the command

```
npm install --save cloudrail-si
```

Find the following piece of code in your *index.js* file, and enter your credentials:

```javascript
cloudrail.Settings.setKey("[Your CloudRail Key]");

var serviceString = process.argv[2].toLowerCase();
var service;

switch(serviceString) {
  case "paypal":
    service = new cloudrail.services.PayPal(null, true, "[PayPal Client Identifier]", "[PayPal Client Secret]");
    break;
  case "stripe":
    service = new cloudrail.services.Stripe(null, "[Stripe Secret Key]");
    break;
}
```

## Using the program

When executing the program, you have to give it the service name ("paypal" or "stripe") as argument.
You can interact with the program by entering different commands. The program will display all possible input commands at startup.