# CloudRail SI Node.JS SDK changelog

* **2.21.12**
  * OneDriveBusiness: Fix Authentication process
  * GoogleDrive: Fix fileExists method
  * Backblaze: Fix an issue related to advanced request

* **2.21.11**
  * OneDriveBusiness: Fix missing url encoding of the client secret on refreshing tokens
  * GoogleCloudPlatform: Add a missing internal function
  * MicrosoftAzure: Fix an issue in the advanced request function 


* **2.21.10**
  * OneDrive: Attach missing state parameter to authentication url 
  * Facebook: Removed user_about_me scope which shows description. This is removed from Facebook
  * Google Cloud: Added object name encoding to google cloud

* **2.21.9**
  * Business Cloud Storage : Implement listFilesWithPrefix method . 
  * Minor fixes for Google Drive API. 


* **2.21.8**
  * Google Cloud Platform: Implement missing paging in listFiles() method
  * Egnyte & Google Drive: Minor fixes
  * Google Cloud Platform & Amazon S3: Add missing advanced request feature
  * Microsoft Azure: Fix listFiles() method and implement advanced request
  * Yelp: Update to a new API version including a different authentication

* **2.21.7**
  * Add a new method to the CloudStorage interface that allows uploading files with a custom modified date
  * Fix a missing Authorization header in getChildren and getChildrenPage of OneDrive
  * Fix error handling in Dropbox
  * Fix an issue with upload in PCloud

* **2.21.6**
  * Add PCloud as a new service to the CloudStorage interface
  * Bugfix for GoogleDrive

* **2.21.4**
  * Bugfix for GoogleDrive and SlackBot

* **2.21.3**
  * Add a fix for AmazonS3's listFiles method
  * Bug fixes for GMail and Telegram
  * Add SlackBot as a new service for the messaging interface

* **2.21.0**
  * Full release of the messaging interface including FacebookMessanger, Viber, Line and Telegram
  * Bugfix for Amazon S3: The getChildrenPage() method was not returning more than 1000 files
  * OneDriveBusiness is now using the new Microsoft Graph API
  * GoogleDrive now uses the state parameter during authentication
  * Box: Locating a file within a folder containing more than 100 files was not working properly
  * GoogleDrive: Some files could not be found even though the files existed and the getChildrenPage method was not working properly for large folders
  * CloudStorage: The exists method now returns true for the root folder

* **2.20.0**
  * Release the new video interface containing YouTube, Twitch and Vimeo. This interface allows you to upload and search for videos as well as querying all kinds of metadata.

* **2.19.0**
  * Add the possibility to send attachments to the Email interface and also introduce GMail as a new integration
  * Update Yelp to their new API
  * Update OneDrive to use the new Microsoft Graph API
  * Egnyte now correctly returns the username
  * Fix an issue within getChildrenPage that occurred in most CloudStorage services

* **2.18.1**
  * Fix the authentication for Twitter which did not allow a user to successfully authenticate

* **2.18.0**
  * Add a new method to the cloud storage interface that allows to search for files and folders

* **2.17.4**
  * Add Twizo to the SMS interface
  * Add the Microsoft service which uses the new Microsoft Graph API to access OneDrive

* **2.17.3**
  * Fixed issues with OneDrive for files and folders having whitespace in their names. Caused by an unannounced API change by Microsoft.
  * Downloading a Google Documents file with Google Drive now downloads an export of the file as PDF.

* **2.17.2**
  * Minor fix for an issue where potential errors would be misattributed to another service

* **2.17.1**
  * Fixed broken Facebook constructor
  * Small fixes for optional scopes parameter

* **2.17.0**
  * Added Product Hunt as a new service to the Profile interface
  * Added an additional, optional "scopes" constructor parameter to all services doing OAuth with programatically settable scopes
  
* **2.16.0**
  * Advanced Request now available for all services

* **2.15.0**
  * Advanced Request now available for the services implementing the Profile interface

* **2.14.0**
  * Added a new function to make supported raw HTTP requests to the services implementing Cloud Storage (advanced request)

* **2.13.0**
  * Added functions to post pictures and videos to a user's wall to the Social interface, Facebook and Twitter have been extended accordingly
  * Added FacebookPage as a new service to the Social interface. It allows posting updates/pictures/videos to a Facebook page

* **2.12.0**
  * Google Cloud Services added as a new integration in the Business Cloud Storage interface
  * Fixed an issue with Google Drive reauthentication

* **2.11.1**
  * Fixed an issue where Box would return incorrect lastModified timestamps
  * Fixed an issue with file/folder names containing single quotes on Google Drive
  * Dropbox now returns an already created share link 

* **2.11.0**
  * Added OneDrive for Business as a new service to the Cloud Storage interface
  * Bugfixes to OneDrive and Dropbox concerning files and folders with special characters
  * Fixed an issue where Box would return maximally 100 children of a folder
  * Added a function to retrieve children in chunks to all Cloud Storage services
  * Updated Google Drive from API version 2 to 3

* **2.10.1**
  * Heroku has been added as a new service implementing Profile. 
  It supports the retrieval of a unique ID, the full name and the email address.
  It is still in Beta and not officially listed or documented.

* **2.10.0**
  * Introduced new interface called Business Cloud Storage
  * Amazon S3 has been added as a new service implementing Business Cloud Storage
  * Microsoft Azure has been added as a new service implementing Business Cloud Storage
  * Backblaze has been added as a new service implementing Business Cloud Storage
  * Rackspace has been added as a new service implementing Business Cloud Storage

* **2.9.3**
  * Small fixes to error reporting of some services
  * Facebook integration now uses newest version of the Facebook API
  
* **2.9.2**
  * Fixed an issue where a timeout would keep code using the library running indefinitely
  
* **2.9.1**
  * Added Egnyte as a new service, implementing the CloudStorage interface. 
    It does not support retrieval of user login, user name, available and 
    used space or thumbnails since the API exposes no such information yet.
  * Fixed bugs where GoogleDrive and OneDrive would not return ImageMetaData
    on elements retrieved through getChildren()
  
* **2.9.0**
  * The services in the CloudStorage interface now have an additional method to get thumbnails
  * The CloudMetaData objects now have additional dimension information for images
  
* **2.8.1**
  * Fixed an issue where an Error was thrown when logging out an already logged out instance of Box
  
* **2.8.0**
  * BREAKING: License key is now mandatory
  * Bugfixes for Box and Dropbox integrations

* **2.7.0**
  * BREAKING: The RedirectReceiver's callback function has a Node-style signature now
  * Added standard implementation for a RedirectReceiver with "electron" framework
  * Minor bugfixes
  
* **2.6.2**
  * Added standard implementation for local RedirectReceiver
  
* **2.6.1**
  * Made SendGrid integration more robust by updating to API v3
  
* **2.6.0**
  * Added "exists" function to "CloudStorage" interface
  * Added optional license key integration  
  
* **2.5.3**
  * Fixed incompatibility with older Node versions
  * Better quality of error messages  
  
* **2.5.2**
  * Bugfix to have errors contain messages  
  
* **2.5.1**
  * Compile to ES5 instead of ES6 for compatibility reasons
  * Minor bugfixes
    
* **2.5.0**
  * Included "Social" interface
  * Added space allocation information to "CloudStorage"  
  
* **2.4.0**
  * Initial release (Non-minor version numbers between SDKs for different platforms used to be synchronized)





  

  



