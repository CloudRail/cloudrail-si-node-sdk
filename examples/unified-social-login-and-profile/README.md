# Unified Social Login and Profile example

This is a simple example that shows how you can easily access different social network services using the [CloudRail Unified Social Profile API](https://cloudrail.com/integrations/interfaces/Profile;platformId=Nodejs).

You run the program by executing it with the desired network's name as command line argument, for example:

```
node index.js facebook
```

The program will then redirect the user to a browser where they have to login. Afterwards, the program will display the user's information, including their unique identifier which can be used for social logins.

## Prerequisites

You need to have node.js installed ([get it from here](http://nodejs.org/)) and need to have developer credentials for the services you want to use. Instructions on how they can be acquired can be found on our [Unified Social Profile API site](https://cloudrail.com/integrations/interfaces/Profile;platformId=Nodejs;serviceIds=Facebook%2CGitHub%2CGooglePlus%2CHeroku%2CInstagram%2CLinkedIn%2CProductHunt%2CSlack%2CTwitter%2CMicrosoftLive%2CYahoo). You also need a CloudRail API key that you can [get here](https://cloudrail.com/signup).

Install the cloudrail-si node.js SDK by navigating to the project folder in a terminal and executing the command

```
npm install --save cloudrail-si
```

Find the following piece of code in your *index.js* file, and enter your developer credentials. Optionally, change the used port.


```javascript
cloudrail.Settings.setKey("[Your CloudRail Key]");

const port = 8082; // or any other free port on the local machine
```



```javascript
switch(serviceString) {
  case "facebook":
    service = new cloudrail.services.Facebook(
      cloudrail.RedirectReceivers.getLocalAuthenticator(8082),
      "[Facebook Client Identifier]",
      "[Facebook Client Secret]",
      "http://localhost:" + port + "/" + "/",
      "someState"
    );
    break;
  case "github":
    service = new cloudrail.services.GitHub(
      cloudrail.RedirectReceivers.getLocalAuthenticator(8082),
      "[GitHub Client Identifier]",
      "[GitHub Client Secret]",
      "http://localhost:" + port + "/",
      "someState"
    );
    break;
  case "googleplus":
    service = new cloudrail.services.GooglePlus(
      cloudrail.RedirectReceivers.getLocalAuthenticator(8082),
      "[Google Plus Client Identifier]",
      "[Google Plus Client Secret]",
      "http://localhost:" + port + "/",
      "someState"
    );
    break;
  case "heroku":
    service = new cloudrail.services.Heroku(
      cloudrail.RedirectReceivers.getLocalAuthenticator(8082),
      "[Heroku Client Identifier]",
      "[Heroku Client Secret]",
      "http://localhost:" + port + "/",
      "someState"
    );
    break;
  case "instagram":
    service = new cloudrail.services.Instagram(
      cloudrail.RedirectReceivers.getLocalAuthenticator(8082),
      "[Instagram Client Identifier]",
      "[Instagram Client Secret]",
      "http://localhost:" + port + "/",
      "someState"
    );
    break;
  case "linkedin":
    service = new cloudrail.services.LinkedIn(
      cloudrail.RedirectReceivers.getLocalAuthenticator(8082),
      "[LinkedIn Client Identifier]",
      "[LinkedIn Client Secret]",
      "http://localhost:" + port + "/",
      "someState"
    );
    break;
  case "producthunt":
    service = new cloudrail.services.ProductHunt(
      cloudrail.RedirectReceivers.getLocalAuthenticator(8082),
      "[Product Hunt Client Identifier]",
      "[Product Hunt Client Secret]",
      "http://localhost:" + port + "/",
      "someState"
    );
    break;
  case "slack":
    service = new cloudrail.services.Slack(
      cloudrail.RedirectReceivers.getLocalAuthenticator(8082),
      "[Slack Client Identifier]",
      "[Slack Client Secret]",
      "http://localhost:" + port + "/",
      "someState"
    );
    break;
  case "twitter":
    service = new cloudrail.services.Twitter(
      cloudrail.RedirectReceivers.getLocalAuthenticator(8082),
      "[Twitter Client Identifier]",
      "[Twitter Client Secret]",
      "http://localhost:" + port + "/"
    );
    break;
  case "microsoftlive":
    service = new cloudrail.services.MicrosoftLive(
      cloudrail.RedirectReceivers.getLocalAuthenticator(8082),
      "[Windows Live Client Identifier]",
      "[Windows Live Client Secret]",
      "http://localhost:" + port + "/",
      "someState"
    );
    break;
  case "yahoo":
    service = new cloudrail.services.Yahoo(
      cloudrail.RedirectReceivers.getLocalAuthenticator(8082),
      "[Yahoo Client Identifier]",
      "[Yahoo Client Secret]",
      "http://localhost:" + port + "/",
      "someState"
    );
    break;
}
```