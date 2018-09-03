# Unified Bucket Cloud Storage example

This is an example that shows how you can use the [CloudRail Unified Bucket Cloud Storage API](https://cloudrail.com/integrations/interfaces/BusinessCloudStorage;platformId=Nodejs) to integrate different Bucket Cloud Storage services in one application. It is a simple command-line program that makes it possible to display, create and delete buckets and to list, download and delete files.

## Prerequisites

You need to have node.js installed ([get it from here](http://nodejs.org/)) and need to have developer credentials for the services you want to use. Instructions on how they can be acquired can be found on our [Unified Bucket Cloud Storage API site](https://cloudrail.com/integrations/interfaces/BusinessCloudStorage;platformId=Nodejs;serviceIds=AmazonS3%2CBackblaze%2CGoogleCloudPlatform%2CMicrosoftAzure%2CRackspace). You also need a CloudRail API key that you can [get here](https://cloudrail.com/signup).

Install the cloudrail-si node.js SDK by navigating to the project folder in a terminal and executing the command

```
npm install --save cloudrail-si
```

Find the following piece of code in your *index.js* file, uncomment the service you want to use, and enter your developer credentials:


```javascript
cloudrail.Settings.setKey("[Your CloudRail Key]");
var service;
//service = new cloudrail.services.AmazonS3(null, "[Your S3 Access Key ID]", "[Your S3 Secret Access Key]", "[Your AWS region]");
//service = new cloudrail.services.Backblaze(null, "[Your Backblaze Account ID]", "[Your Backblaze App Key]");
//service = new cloudrail.services.GoogleCloudPlatform(null, "[Your Google Client Email]", "[Your Google Private Key]", "[Your Google Project ID]");
//service = new cloudrail.services.MicrosoftAzure(null, "[Your Azure Account Name]", "[Your Azure Access Key]");
//service = new cloudrail.services.Rackspace(null, "[Your Rackspace User Name]", "[Your Rackspace API Key]", "[Your Rackspace Region]");

```

## Using the program

The program works with simple command-line arguments. On startup, it displays a numbered list of your buckets. You can for example list the files in a bucket by entering *"open [bucketNumber]"* where [bucketNumber] is the number printed in front of the bucket you want to view. To see all the possible commands, enter *"help"*.