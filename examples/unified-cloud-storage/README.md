# Unified Cloud Storage example

This is an example that shows how you can use the [CloudRail Unified Cloud Storage API](https://cloudrail.com/integrations/interfaces/CloudStorage;platformId=Nodejs) to integrate different Cloud Storage services (box, Dropbox, Egnyte, Google Drive, OneDrive, OneDrive for Business) in one application. It is a simple command-line program that makes it possible to browse folders and download files.

## Prerequisites

You need to have node.js installed ([get it from here](http://nodejs.org/)) and need to have developer credentials for the services you want to use. Instructions on how they can be acquired can be found on our [Unified Cloud Storage API site](https://cloudrail.com/integrations/interfaces/CloudStorage;platformId=Nodejs;serviceIds=Box%2CDropbox%2CEgnyte%2CGoogleDrive%2COneDrive%2COneDriveBusiness). You also need a CloudRail API key that you can [get here](https://cloudrail.com/signup).

Install the cloudrail-si node.js SDK by navigating to the project folder in a terminal and executing the command

```
npm install --save cloudrail-si
```

If you want nice images for folders and files, also install console-emoji

```
npm install --save console-emoji
```

Find the following piece of code in your *index.js* file, uncomment the service you want to use, and enter your developer credentials. Also, enter your CloudRail key and change the port as needed.


```javascript
cloudrail.Settings.setKey("[Your CloudRail Key]");

var port = 8082; // or any other free port on the local machine

//const service = new cloudrail.services.Box(cloudrail.RedirectReceivers.getLocalAuthenticator(port),
//    "[Box Client Identifier]", "[Box Client Secret]", "http://localhost:" + port + "/", "someState");
//const service = new cloudrail.services.Dropbox(cloudrail.RedirectReceivers.getLocalAuthenticator(port),
//    "[Dropbox Client Identifier]", "[Dropbox Client Secret]", "http://localhost:" + port + "/", "someState");
//const service = new cloudrail.services.Egnyte(cloudrail.RedirectReceivers.getLocalAuthenticator(port),
//    "[Your Egnyte Domain]", "[Your Egnyte API Key]", "[Your Egnyte Shared Secret]", "http://localhost:" + port + "/", "someState");
//const service = new cloudrail.services.GoogleDrive(cloudrail.RedirectReceivers.getLocalAuthenticator(port),
//    "[Google Drive Client Identifier]", "[Google Drive Client Secret]", "http://localhost:" + port + "/", "someState");
//const service = new cloudrail.services.OneDrive(cloudrail.RedirectReceivers.getLocalAuthenticator(port),
//    "[OneDrive Client Identifier]", "[OneDrive Client Secret]", "http://localhost:" + port + "/", "someState");
//const service = new cloudrail.services.OneDriveBusiness(cloudrail.RedirectReceivers.getLocalAuthenticator(port),
//    "[OneDrive Business Client Identifier]", "[OneDrive Business Client Secret]", "http://localhost:" + port + "/", "someState");

```

## Using the program

The program works with simple command-line arguments. On startup, it displays the list of files and folders in your root directory. You can enter a folder by entering *"cd [relativePath]"* where [relativePath] is the path to the folder starting from the currently displayed folder. You can go up to the parent folder by entering *"cd .."* and you can download a file in the current folder by entering *"download [fileName]"*.