[![npm version][npmimg]][npm]
<p align="center">
  <img width="200px" src="http://cloudrail.github.io/img/cloudrail_logo_github.png"/>
</p>

# CloudRail SI for node.js

Integrate Multiple Services With Just One API

<p align="center">
  <img width="300px" src="http://cloudrail.github.io/img/cloudrail_si_github.png"/>
</p>

CloudRail is an API integration solution which abstracts multiple APIs from different providers into a single and universal interface.
<p align="center">
  <img width="800px" src="http://cloudrail.github.io/img/available_interfaces_v3.png"/>
</p>
---
---

Learn more about CloudRail at https://cloudrail.com

Full documentation can be found [here](https://cloudrail.com/integrations)

---
---

With CloudRail, you can easily integrate external APIs into your application. 
CloudRail provides abstracted interfaces that take several services and then exposes a developer-friendly API that uses common functions between all providers. 
This means that, for example, upload() works in exactly the same way for Dropbox as it does for Google Drive, OneDrive, and other Cloud Storage Services, and getEmail() works similarly the same way across all social networks.

## NPM

```
npm install cloudrail-si
```


## Current Interfaces
Interface | Included Services
--- | ---
Cloud Storage | Dropbox, Google Drive, OneDrive, OneDrive Business, Box, Egnyte
Business Cloud Storage | Amazon S3, Microsoft Azure, Google Cloud Services, Rackspace, Backblaze
Social Profile | Facebook, GitHub, Google+, LinkedIn, Slack, Twitter, Windows Live, Yahoo, Instagram, Heroku
Social Interaction | Facebook, Facebook Page, Twitter
Payment | PayPal, Stripe
Email | Maljet, Sendgrid
SMS | Twilio, Nexmo
Point of Interest | Google Places, Foursquare, Yelp
Video | YouTube, Twitch, Vimeo
Messaging | Facebook Messenger, Telegram, Line, Viber
---
### Cloud Storage Interface:

* Dropbox
* Box
* Google Drive
* Microsoft OneDrive
* Microsoft OneDrive for Business
* Egnyte

#### Features:

* Download files from Cloud Storage.
* Upload files to Cloud Storage.
* Get Meta Data of files, folders and perform all standard operations (copy, move, etc) with them.
* Retrieve user and quota information
* Generate share links for files and folders
* Get thumbnails for images

[Full Documentation](https://cloudrail.com/integrations/interfaces/CloudStorage;platformId=Nodejs)
#### Code Example:

```javascript
const cloudrail = require("cloudrail-si");
cloudrail.Settings.setKey("[CloudRail License Key]");

// let cs = new cloudrail.services.Box(redirectReceiver, "[clientIdentifier]", "[clientSecret]", "[redirectUri]", "[state]");
// let cs = new cloudrail.services.OneDrive(redirectReceiver, "[clientIdentifier]", "[clientSecret]", "[redirectUri]", "[state]");
// let cs = new cloudrail.services.OneDriveBusiness(redirectReceiver, "[clientIdentifier]", "[clientSecret]", "[redirectUri]", "[state]");
// let cs = new cloudrail.services.GoogleDrive(redirectReceiver, "[clientIdentifier]", "[clientSecret]", "[redirectUri]", "[state]");
let cs = new cloudrail.services.Dropbox(redirectReceiver, "[clientIdentifier]", "[clientSecret]", "[redirectUri]", "[state]");

cs.createFolder("/TestFolder", (err) => { // <---
    if (err) throw err;
    let fileStream = fs.createReadStream("UserData.csv");
    let size = fs.statSync("UserData.csv").size;
    cs.upload("/TestFolder/Data.csv", fileStream, size, false, (err) => { // <---
        if (err) throw err;
        console.log("Upload successfully finished");
    });
});
```
---
### Business/Bucket Cloud Storage Interface:

* Amazon Web Services S3
* Microsoft Azure
* Google Cloud Services
* Rackspace
* Backblaze

#### Features

* Create, delete and list buckets
* Upload files
* Download files
* List files in a bucket and delete files
* Get file metadata (last modified, size, etc.)

[Full Documentation](https://cloudrail.com/integrations/interfaces/BusinessCloudStorage;platformId=Nodejs)
#### Code Example

```javascript
const cloudrail = require("cloudrail-si");
cloudrail.Settings.setKey("[CloudRail License Key]");

// let bcs = new cloudrail.services.AmazonS3(null, "[accessKeyId]", "[secretAccessKey]", "[region]");
// let bcs = new cloudrail.services.MicrosoftAzure(null, "[accountName]", "[accessKey]");
// let bcs = new cloudrail.services.GoogleCloudServices(null, "[clientEmail]", "[privateKey]", "[projectId]");
// let bcs = new cloudrail.services.Rackspace(null, "[userName]", "[apiKey]", "[region]");
let bcs = new cloudrail.services.Backblaze(null, "[accountId]", "[appKey]");

bcs.createBucket("myNewBucket", (err, bucket) => {
    if (err) throw err;
    let fileStream = fs.createReadStream("UserData.csv");
    let size = fs.statSync("UserData.csv").size;
    bcs.upload(bucket, "Data.csv", fileStream, size, (err) => { // <---
        if (err) throw err;
        console.log("Upload successfully finished");
    });
});
```
---
### Social Profile Interface:

* Facebook
* Github
* Google Plus
* LinkedIn
* Slack
* Twitter
* Windows Live
* Yahoo
* Instagram
* Heroku

#### Features

* Get profile information, including full names, emails, genders, date of birth, and locales.
* Retrieve profile pictures.
* Login using the Social Network.

[Full Documentation](https://cloudrail.com/integrations/interfaces/Profile;platformId=Nodejs)
#### Code Example:

```javascript
const cloudrail = require("cloudrail-si");
cloudrail.Settings.setKey("[CloudRail License Key]");

// let profile = new cloudrail.services.GooglePlus(redirectReceiver, "[clientIdentifier]", "[clientSecret]", "[redirectUri]", "[state]");
// let profile = new cloudrail.services.GitHub(redirectReceiver, "[clientIdentifier]", "[clientSecret]", "[redirectUri]", "[state]");
// let profile = new cloudrail.services.Slack(redirectReceiver, "[clientIdentifier]", "[clientSecret]", "[redirectUri]", "[state]");
// let profile = new cloudrail.services.Instagram(redirectReceiver, "[clientIdentifier]", "[clientSecret]", "[redirectUri]", "[state]");
// ...
let profile = new cloudrail.services.Facebook(redirectReceiver, "[clientIdentifier]", "[clientSecret]", "[redirectUri]", "[state]");

profile.getFullName((err, fullName) => {
    if (err) throw err;
    console.log("User's full name is " + fullName);
});

profile.getEmail((err, email) => {
    if (err) throw err;
    console.log("User's email address is " + email);
});
```
---
### Social Interaction Interface:

* Facebook (interacts with a user)
* Facebook Pages (interacts with a page)
* Twitter

#### Features

* Get the IDs of a user's friends/followers. Works well with the Profile interface's "login with" to check if two of your users are friends on a platform
* Post messages to a wall/stream
* Post pictures and videos to a wall/stream

[Full Documentation](https://cloudrail.com/integrations/interfaces/Social;platformId=Nodejs)
#### Code Example:

```javascript
const cloudrail = require("cloudrail-si");
cloudrail.Settings.setKey("[CloudRail License Key]");

// let social = new cloudrail.services.Facebook(redirectReceiver, "[clientIdentifier]", "[clientSecret]", "[redirectUri]", "[state]");
// let social = new cloudrail.services.FacebookPage(redirectReceiver, "[pageName]", "[clientIdentifier]", "[clientSecret]", "[redirectUri]", "[state]");
let social = new cloudrail.services.Twitter(redirectReceiver, "[clientIdentifier]", "[clientSecret]", "[redirectUri]");

social.postUpdate("Hello from CloudRail", (err) => {
    if (err) throw err;
    console.log("Update posted");
});

let fileStream = fs.createReadStream("video.mp4");
let size = fs.statSync("video.mp4").size;
social.postVideo("This is a test video", fileStream, size, "video/mp4", (err) => {
    if (err) throw err;
    console.log("Video posted");
});
```
---
### Payment Interface:

* PayPal
* Stripe

#### Features

* Perform charges
* Refund previously made charges
* Manage subscriptions

[Full Documentation](https://cloudrail.com/integrations/interfaces/Payment;platformId=Nodejs)
#### Code Example

```javascript
const cloudrail = require("cloudrail-si");
cloudrail.Settings.setKey("[CloudRail License Key]");

// let payment = new cloudrail.services.Stripe(null, "[secretKey]");
let payment = new cloudrail.services.PayPal(null, true, "[clientIdentifier]", "[clientSecret]");

let source = new cloudrail.types.CreditCard(null, 6, 2021, "xxxxxxxxxxxxxxxx", "visa", "<FirstName>", "<LastName>", null);
payment.createCharge(500, "USD", source, (err, charge) => {
    if (err) throw err;
    console.log("Successfully charged " + charge.amount + " " + charge.currency);
});
```
---
### Email Interface:

* Mailjet
* Sendgrid

#### Features

* Send Email

[Full Documentation](https://cloudrail.com/integrations/interfaces/Email;platformId=Nodejs)

#### Code Example

```javascript
const cloudrail = require("cloudrail-si");
cloudrail.Settings.setKey("[CloudRail License Key]");

// let email = new cloudrail.services.Mailjet(null, "[clientID]", "[clientSecret]");
let email = new cloudrail.services.Sendgrid(null, "[APIKey]");

email.sendEmail("info@cloudrail.com", "CloudRail", ["foo@bar.com", "bar@foo.com"], "Welcome", "Hello from CloudRail", null, null, null, (err) => {
    if (err) throw err;
    console.log("Email successfully sent");
});
```
---
### SMS Interface:

* Twilio
* Nexmo

#### Features

* Send SMS

[Full Documentation](https://cloudrail.com/integrations/interfaces/SMS;platformId=Nodejs)

#### Code Example

```javascript
const cloudrail = require("cloudrail-si");
cloudrail.Settings.setKey("[CloudRail License Key]");

// let sms = new cloudrail.services.Nexmo(null, "[clientIdentifier]", "[clientSecret]");
let sms = new cloudrail.services.Twilio(null, "[clientIdentifier]", "[clientSecret]");

sms.sendSMS("CloudRail", "+4912345678", "Hello from CloudRail", (err) => {
    if (err) throw err;
    console.log("SMS successfully sent");
});
```
---
### Points of Interest Interface:

* Google Places
* Foursquare
* Yelp

#### Features

* Get a list of POIs nearby
* Filter by categories or search term

[Full Documentation](https://cloudrail.com/integrations/interfaces/PointsOfInterests;platformId=Nodejs)
#### Code Example

``` javascript
const cloudrail = require("cloudrail-si");
cloudrail.Settings.setKey("[CloudRail License Key]");

// let poi = new cloudrail.services.Foursquare(null, "[clientID]", "[clientSecret]");
// let poi = new cloudrail.services.Yelp(null, "[consumerKey]", "[consumerSecret]", "[token]", "[tokenSecret]");
let poi = new cloudrail.services.GooglePlaces(null, "[apiKey]");

poi.getNearbyPOIs(49.4557091, 8.5279138, 1000, "restaurant", null, (err, pois) => {
    if (err) throw err;
    console.log("Amount of locations called 'restaurant' in a 1 km radius around the given coordinates: " + pois.length);
});
```
---
### Video Interface:

* YouTube
* Twitch
* Vimeo

#### Features

* Get channel metadata
* List videos for a channel
* Get video metadata
* Search for videos
* Upload a video

[Full Documentation](https://cloudrail.com/integrations/interfaces/Video;platformId=Nodejs)
#### Code Example

``` javascript
const cloudrail = require("cloudrail-si");
cloudrail.Settings.setKey("[CloudRail License Key]");

// let video = new cloudrail.services.Twitch(redirectReceiver, "[clientID]", "[clientSecret]");
// let video = new cloudrail.services.Vimeo(redirectReceiver, "[clientID]", "[clientSecret]");
let video = new cloudrail.services.YouTube(redirectReceiver, "[clientID]", "", "com.cloudrail.example:/auth", "state");

video.searchVideos("CloudRail", 0, 50, (err, videos) => {
    if (err) throw err;
    console.log("Videos: " + videos);
});
```
---
### Messaging Interface:

* Facebook Messenger
* Telegram
* Line
* Viber

#### Features

* Send text messages
* Send files, images, videos and audios
* Parse a message received on your webhook
* Download the content of an attachment sent to your webhook

[Full Documentation](https://cloudrail.com/integrations/interfaces/Messaging;platformId=Nodejs)
#### Code Example

``` javascript
const cloudrail = require("cloudrail-si");
cloudrail.Settings.setKey("[CloudRail License Key]");

// let messaging = new cloudrail.services.Line(null, "[BotToken]");
// let messaging = new cloudrail.services.Telegram(null, "[BotToken]", "[WebhookUrl]");
// let messaging = new cloudrail.services.Viber(null, "[BotToken]", "[WebhookUrl]", "[BotName]");
let messaging = new cloudrail.services.FacebookMessenger(null, "[BotToken]");

messaging.sendMessage("92hf2f83f9", "Greetings from CloudRail!", (err, message) => {
    if (err) throw err;
    console.log("Message: " + message);
});
```
---

More interfaces are coming soon.

## Advantages of Using CloudRail

* Consistent Interfaces: As functions work the same across all services, you can perform tasks between services simply.

* Easy Authentication: CloudRail includes easy ways to authenticate, to remove one of the biggest hassles of coding for external APIs.

* Switch services instantly: One line of code is needed to set up the service you are using. Changing which service is as simple as changing the name to the one you wish to use.

* Simple Documentation: There is no searching around Stack Overflow for the answer. The [CloudRail Wiki](https://documentation.cloudrail.com/nodejs/nodejs/Home) is regularly updated, clean, and simple to use.

* No Maintenance Times: The CloudRail Libraries are updated when a provider changes their API.

* Direct Data: Everything happens directly in the Library. No data ever passes a CloudRail server.

## NPM

```
npm install cloudrail-si
```

## Typescript

(this only concerns Typescript users)

The package includes an *index.d.ts* file. To use the typings provided, include services and types like so:

```javascript
/// <reference path="node_modules/cloudrail-si/index.d.ts" />

import {PointsOfInterest} from "cloudrail-si/interfaces/PointsOfInterest";
import {Foursquare} from "cloudrail-si/services/Foursquare";
import {POI} from "cloudrail-si/types/POI";

let poi:PointsOfInterest = new Foursquare(null, "[clientID]", "[clientSecret]");

poi.getNearbyPOIs(49.4557091, 8.5279138, 1000, "restaurant", null, (err:Error, pois:POI[]) => {
    if (err) console.log(err);
    console.log("Amount of locations called 'restaurant' in a 1 km radius around the given coordinates: " + pois.length);
});
```

## Examples

Check out https://github.com/CloudRail/cloudrail-si-node-sdk/tree/master/examples for examples of how to e.g. implement a redirectReceiver and more complex use cases.

## License Key

CloudRail provides a developer portal which offers usage insights for the SDKs and allows you to generate license keys.

It's easy to sign up and generate a key.

Head over to https://developers.cloudrail.com

## Pricing

Learn more about our pricing on https://cloudrail.com/cloudrail-pricing/ 

## Other Platforms

CloudRail is also available for other platforms like Android, iOS and Java. You can find all libraries on https://cloudrail.com

## Questions?

Get in touch at any time by emailing us: support@cloudrail.com

or

Tag a question with cloudrail on [StackOverflow](http://stackoverflow.com/questions/tagged/cloudrail)

[npmimg]: https://img.shields.io/npm/v/cloudrail-si.svg
[npm]: https://www.npmjs.com/package/cloudrail-si
