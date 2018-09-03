# Unified Social Interaction example



This is a simple example that shows how you can easily post updates to different social networks using the [CloudRail Unified Social Interaction API](https://cloudrail.com/integrations/interfaces/Social;platformId=Nodejs).

## Prerequisites

You need to have node.js installed ([get it from here](http://nodejs.org/)) and need to have developer credentials for the services you want to use. Instructions on how they can be acquired can be found on our [Unified Points Of Interest API site](https://cloudrail.com/integrations/interfaces/PointsOfInterest;platformId=Nodejs;serviceIds=Foursquare%2CGooglePlaces%2CYelp). You also need a CloudRail API key that you can [get here](https://cloudrail.com/signup).

Install the cloudrail-si node.js SDK by navigating to the project folder in a terminal and executing the command

```
npm install --save cloudrail-si
```

Find the following piece of code in your *index.js* file, and enter your developer credentials. You might also want to change the port number.

```javascript
const port = 8082; // or any other free port on the local machine

cloudrail.Settings.setKey("[Your CloudRail Key]");

const facebook = new cloudrail.services.Facebook(
    cloudrail.RedirectReceivers.getLocalAuthenticator(port),
    "[Facebook Client Identifier]", "[Facebook Client Secret]",
    "http://localhost:" + port + "/", "someState");

const facebookpage = new cloudrail.services.FacebookPage(
    cloudrail.RedirectReceivers.getLocalAuthenticator(port),
    "[Facebook Page Identifier]", "[Facebook Client Identifier]", "[Facebook Client Secret]",
    "http://localhost:" + port + "/", "someState");

const twitter = new cloudrail.services.Twitter(
    cloudrail.RedirectReceivers.getLocalAuthenticator(port),
    "[Twitter Client Identifier]", "[Twitter Client Secret]",
    "http://localhost:" + port + "/");
```

## Using the program

Call the program with

```
node index.js [network] [status]
```

where *[network]* states which social network to use, and all following arguments build the status update which will be sent to the network.

*network* can either be:

```
"facebook" or "fb" for Facebook,
"facebookpages", "fbpages" or "pages" for Facebook Pages,
"twitter" or "tw" for Twitter

```

If you skip *network*, Facebook will be used. If you skip the status, *"Hello from CloudRail"* will be posted.