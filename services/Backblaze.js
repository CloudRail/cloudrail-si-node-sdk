"use strict";
var Interpreter_1 = require("../servicecode/Interpreter");
var Sandbox_1 = require("../servicecode/Sandbox");
var Helper_1 = require("../helpers/Helper");
var InitSelfTest_1 = require("../servicecode/InitSelfTest");
var Statistics_1 = require("../statistics/Statistics");
var SERVICE_CODE = {
    "Storage:createBucket": [
        ["callFunc", "checkNull", "$P0", "$P2"],
        ["callFunc", "checkAuthentication", "$P0"],
        ["create", "$L4", "Object"],
        ["set", "$L4", "application/json", "Content-Type"],
        ["set", "$L4", "$S0.authorizationToken", "Authorization"],
        ["string.concat", "$L9", "{\"accountId\":\"", "$P0.accountID", "\",\"bucketName\":\"", "$P2", "\",\"bucketType\":\"allPrivate\"}"],
        ["size", "$L10", "$L9"],
        ["string.concat", "$L4.Content-Length", "$L10"],
        ["create", "$L5", "Object"],
        ["string.concat", "$L0", "$S0.apiUrl", "/b2api/v1/b2_create_bucket"],
        ["set", "$L5.url", "$L0"],
        ["set", "$L5.method", "POST"],
        ["set", "$L5.requestHeaders", "$L4"],
        ["stream.stringToStream", "$L9", "$L9"],
        ["set", "$L5.requestBody", "$L9"],
        ["http.requestCall", "$L6", "$L5"],
        ["callFunc", "checkHttpErrors", "$P0", "$L6", "authentication", 200],
        ["stream.streamToString", "$L12", "$L6.responseBody"],
        ["json.parse", "$L12", "$L12"],
        ["create", "$L5", "Bucket"],
        ["set", "$L5.name", "$P2"],
        ["set", "$L5.identifier", "$L12.bucketId"],
        ["set", "$P1", "$L5"]
    ],
    "Storage:deleteBucket": [
        ["callFunc", "checkBucket", "$P0", "$P1"],
        ["callFunc", "checkAuthentication", "$P0"],
        ["create", "$L4", "Object"],
        ["set", "$L4", "application/json", "Content-Type"],
        ["set", "$L4", "$S0.authorizationToken", "Authorization"],
        ["string.concat", "$L9", "{\"accountId\":\"", "$P0.accountID", "\",\"bucketId\":\"", "$P1.identifier", "\"}"],
        ["size", "$L10", "$L9"],
        ["string.concat", "$L4.Content-Length", "$L10"],
        ["create", "$L5", "Object"],
        ["string.concat", "$L0", "$S0.apiUrl", "/b2api/v1/b2_delete_bucket"],
        ["set", "$L5.url", "$L0"],
        ["set", "$L5.method", "POST"],
        ["set", "$L5.requestHeaders", "$L4"],
        ["stream.stringToStream", "$L9", "$L9"],
        ["set", "$L5.requestBody", "$L9"],
        ["http.requestCall", "$L6", "$L5"],
        ["callFunc", "checkHttpErrors", "$P0", "$L6", "authentication", 200]
    ],
    "Storage:listBuckets": [
        ["callFunc", "checkAuthentication", "$P0"],
        ["create", "$L4", "Object"],
        ["set", "$L4", "application/x-www-form-urlencoded", "Content-Type"],
        ["set", "$L4", "$S0.authorizationToken", "Authorization"],
        ["string.concat", "$L9", "{\"accountId\":\"", "$P0.accountID", "\"}"],
        ["size", "$L10", "$L9"],
        ["string.concat", "$L4.Content-Length", "$L10"],
        ["create", "$L5", "Object"],
        ["string.concat", "$L0", "$S0.apiUrl", "/b2api/v1/b2_list_buckets"],
        ["set", "$L5.url", "$L0"],
        ["set", "$L5.method", "POST"],
        ["set", "$L5.requestHeaders", "$L4"],
        ["stream.stringToStream", "$L9", "$L9"],
        ["set", "$L5.requestBody", "$L9"],
        ["http.requestCall", "$L6", "$L5"],
        ["callFunc", "checkHttpErrors", "$P0", "$L6", "authentication", 200],
        ["stream.streamToString", "$L12", "$L6.responseBody"],
        ["json.parse", "$L12", "$L12"],
        ["size", "$L10", "$L12.buckets"],
        ["create", "$L14", "Array"],
        ["if!=than", "$L10", 0, 7],
        ["math.add", "$L10", "$L10", -1],
        ["create", "$L13", "Bucket"],
        ["get", "$L15", "$L12.buckets", "$L10"],
        ["set", "$L13.identifier", "$L15.bucketId"],
        ["set", "$L13.name", "$L15.bucketName"],
        ["push", "$L14", "$L13"],
        ["jumpRel", -8],
        ["set", "$P1", "$L14"]
    ],
    "Storage:getFileMetadata": [
        ["callFunc", "checkBucket", "$P0", "$P2"],
        ["callFunc", "checkNull", "$P0", "$P3"],
        ["callFunc", "checkAuthentication", "$P0"],
        ["create", "$L0", "Object"],
        ["string.concat", "$L0.url", "$S0.apiUrl", "/b2api/v1/b2_list_file_names"],
        ["set", "$L0.method", "POST"],
        ["create", "$L1", "Object"],
        ["set", "$L0.requestHeaders", "$L1"],
        ["set", "$L1.Authorization", "$S0.authorizationToken"],
        ["create", "$L2", "Object"],
        ["set", "$L2.bucketId", "$P2.identifier"],
        ["set", "$L2.startFileName", "$P3"],
        ["set", "$L2.maxFileCount", 1],
        ["json.stringify", "$L3", "$L2"],
        ["size", "$L4", "$L3"],
        ["string.concat", "$L4", "$L4"],
        ["set", "$L1.Content-Length", "$L4"],
        ["stream.stringToStream", "$L3", "$L3"],
        ["set", "$L0.requestBody", "$L3"],
        ["create", "$L4", "Object"],
        ["http.requestCall", "$L4", "$L0"],
        ["callFunc", "checkHttpErrors", "$P0", "$L4", "list file names", 200],
        ["json.parse", "$L5", "$L4.responseBody"],
        ["size", "$L6", "$L5.files"],
        ["if==than", "$L6", 0, 2],
        ["create", "$L6", "Error", "File not found!", "NotFound"],
        ["throwError", "$L6"],
        ["get", "$L6", "$L5.files", 0],
        ["if!=than", "$P3", "$L6.fileName", 2],
        ["create", "$L7", "Error", "File not found!", "NotFound"],
        ["throwError", "$L7"],
        ["create", "$P1", "BusinessFileMetaData"],
        ["set", "$P1.fileName", "$L6.fileName"],
        ["set", "$P1.fileID", "$L6.fileId"],
        ["set", "$P1.size", "$L6.contentLength"],
        ["set", "$P1.lastModified", "$L6.uploadTimestamp"]
    ],
    "Storage:upload": [
        ["callFunc", "checkBucket", "$P0", "$P1"],
        ["callFunc", "checkNull", "$P0", "$P2"],
        ["callFunc", "checkNull", "$P0", "$P3"],
        ["callFunc", "checkSize", "$P0", "$P4"],
        ["callFunc", "checkAuthentication", "$P0"],
        ["callFunc", "getUploadURL", "$P0", "$P1"],
        ["create", "$L4", "Object"],
        ["set", "$L4", "application/octet-stream", "Content-Type"],
        ["set", "$L4", "$S0.uploadAuthorizationToken", "Authorization"],
        ["set", "$L4", "$P2", "X-Bz-File-Name"],
        ["stream.streamToData", "$L3", "$P3"],
        ["hash.sha1", "$L2", "$L3"],
        ["callFunc", "arrayToHex", "$P0", "$L20", "$L2"],
        ["set", "$L4", "$L20", "X-Bz-Content-Sha1"],
        ["string.concat", "$L4.Content-Length", "$P4"],
        ["create", "$L5", "Object"],
        ["set", "$L5.url", "$S0.uploadURL"],
        ["set", "$L5.method", "POST"],
        ["set", "$L5.requestHeaders", "$L4"],
        ["stream.dataToStream", "$L3", "$L3"],
        ["set", "$L5.requestBody", "$L3"],
        ["http.requestCall", "$L6", "$L5"],
        ["callFunc", "checkHttpErrors", "$P0", "$L6", "authentication", 200],
        ["stream.streamToString", "$L12", "$L6.responseBody"],
        ["json.parse", "$L12", "$L12"],
        ["set", "$P1", "$L12.bucketId"]
    ],
    "Storage:download": [
        ["callFunc", "checkNull", "$P0", "$P2"],
        ["callFunc", "checkBucket", "$P0", "$P3"],
        ["callFunc", "checkAuthentication", "$P0"],
        ["create", "$L4", "Object"],
        ["set", "$L4", "application/x-www-form-urlencoded", "Content-Type"],
        ["set", "$L4", "$S0.authorizationToken", "Authorization"],
        ["string.concat", "$L1", "$S0.downloadUrl", "/file/", "$P3.name", "/", "$P2"],
        ["create", "$L5", "Object"],
        ["set", "$L5.url", "$L1"],
        ["set", "$L5.method", "GET"],
        ["set", "$L5.requestHeaders", "$L4"],
        ["http.requestCall", "$L6", "$L5"],
        ["callFunc", "checkHttpErrors", "$P0", "$L6", "authentication", 200],
        ["set", "$P1", "$L6.responseBody"]
    ],
    "Storage:listFiles": [
        ["callFunc", "checkBucket", "$P0", "$P2"],
        ["callFunc", "checkAuthentication", "$P0"],
        ["create", "$L4", "Object"],
        ["set", "$L4", "application/x-www-form-urlencoded", "Content-Type"],
        ["set", "$L4", "$S0.authorizationToken", "Authorization"],
        ["string.concat", "$L9", "{\"bucketId\":\"", "$P2.identifier", "\"", ",", "\"maxFileCount\":", 1000, "}"],
        ["size", "$L10", "$L9"],
        ["string.concat", "$L4.Content-Length", "$L10"],
        ["create", "$L5", "Object"],
        ["string.concat", "$L0", "$S0.apiUrl", "/b2api/v1/b2_list_file_names"],
        ["set", "$L5.url", "$L0"],
        ["set", "$L5.method", "POST"],
        ["set", "$L5.requestHeaders", "$L4"],
        ["stream.stringToStream", "$L9", "$L9"],
        ["set", "$L5.requestBody", "$L9"],
        ["http.requestCall", "$L6", "$L5"],
        ["callFunc", "checkHttpErrors", "$P0", "$L6", "authentication", 200],
        ["create", "$L14", "Array"],
        ["stream.streamToString", "$L12", "$L6.responseBody"],
        ["json.parse", "$L12", "$L12"],
        ["size", "$L10", "$L12.files"],
        ["if!=than", "$L10", 0, 9],
        ["math.add", "$L10", "$L10", -1],
        ["create", "$L13", "BusinessFileMetaData"],
        ["get", "$L15", "$L12.files", "$L10"],
        ["set", "$L13.fileID", "$L15.fileId"],
        ["set", "$L13.fileName", "$L15.fileName"],
        ["set", "$L13.lastModified", "$L15.uploadTimestamp"],
        ["set", "$L13.size", "$L15.contentLength"],
        ["push", "$L14", "$L13"],
        ["jumpRel", -10],
        ["if!=than", "$L12.nextFileName", null, 9],
        ["string.concat", "$L9", "{\"bucketId\":\"", "$P2.identifier", "\"", ",", "\"maxFileCount\":", 1000, ",", "\"startFileName\":", "\"", "$L12.nextFileName", "\"", "}"],
        ["size", "$L10", "$L9"],
        ["string.concat", "$L4.Content-Length", "$L10"],
        ["set", "$L5.requestHeaders", "$L4"],
        ["stream.stringToStream", "$L9", "$L9"],
        ["set", "$L5.requestBody", "$L9"],
        ["http.requestCall", "$L6", "$L5"],
        ["callFunc", "checkHttpErrors", "$P0", "$L6", "authentication", 200],
        ["jumpRel", -23],
        ["set", "$P1", "$L14"]
    ],
    "Storage:listFilesWithPrefix": [
        ["callFunc", "checkBucket", "$P0", "$P2"],
        ["callFunc", "checkPrefix", "$P0", "$P3"],
        ["callFunc", "checkAuthentication", "$P0"],
        ["create", "$L4", "Object"],
        ["set", "$L4", "application/x-www-form-urlencoded", "Content-Type"],
        ["set", "$L4", "$S0.authorizationToken", "Authorization"],
        ["string.concat", "$L9", "{\"bucketId\":\"", "$P2.identifier", "\"", ",", "\"maxFileCount\":", 1000, ",", "\"prefix\":\"", "$P3", "\"", "}"],
        ["size", "$L10", "$L9"],
        ["string.concat", "$L4.Content-Length", "$L10"],
        ["create", "$L5", "Object"],
        ["string.concat", "$L0", "$S0.apiUrl", "/b2api/v1/b2_list_file_names"],
        ["set", "$L5.url", "$L0"],
        ["set", "$L5.method", "POST"],
        ["set", "$L5.requestHeaders", "$L4"],
        ["stream.stringToStream", "$L9", "$L9"],
        ["set", "$L5.requestBody", "$L9"],
        ["http.requestCall", "$L6", "$L5"],
        ["callFunc", "checkHttpErrors", "$P0", "$L6", "authentication", 200],
        ["create", "$L14", "Array"],
        ["stream.streamToString", "$L12", "$L6.responseBody"],
        ["json.parse", "$L12", "$L12"],
        ["size", "$L10", "$L12.files"],
        ["if!=than", "$L10", 0, 9],
        ["math.add", "$L10", "$L10", -1],
        ["create", "$L13", "BusinessFileMetaData"],
        ["get", "$L15", "$L12.files", "$L10"],
        ["set", "$L13.fileID", "$L15.fileId"],
        ["set", "$L13.fileName", "$L15.fileName"],
        ["set", "$L13.lastModified", "$L15.uploadTimestamp"],
        ["set", "$L13.size", "$L15.contentLength"],
        ["push", "$L14", "$L13"],
        ["jumpRel", -10],
        ["if!=than", "$L12.nextFileName", null, 9],
        ["string.concat", "$L9", "{\"bucketId\":\"", "$P2.identifier", "\"", ",", "\"maxFileCount\":", 1000, ",", "\"startFileName\":", "\"", "$L12.nextFileName", "\"", "}"],
        ["size", "$L10", "$L9"],
        ["string.concat", "$L4.Content-Length", "$L10"],
        ["set", "$L5.requestHeaders", "$L4"],
        ["stream.stringToStream", "$L9", "$L9"],
        ["set", "$L5.requestBody", "$L9"],
        ["http.requestCall", "$L6", "$L5"],
        ["callFunc", "checkHttpErrors", "$P0", "$L6", "authentication", 200],
        ["jumpRel", -23],
        ["set", "$P1", "$L14"]
    ],
    "checkPrefix": [
        ["if==than", "$P1", null, 2],
        ["create", "$L1", "Error", "Prefix supplied is null", "IllegalArgument"],
        ["throwError", "$L1"]
    ],
    "Storage:deleteFile": [
        ["callFunc", "Storage:getFileMetadata", "$P0", "$L0", "$P2", "$P1"],
        ["get", "$L15", "$L0.fileID"],
        ["create", "$L4", "Object"],
        ["set", "$L4", "application/x-www-form-urlencoded", "Content-Type"],
        ["set", "$L4", "$S0.authorizationToken", "Authorization"],
        ["string.concat", "$L9", "{\"fileName\":\"", "$P1", "\",\"fileId\":\"", "$L15", "\"}"],
        ["size", "$L10", "$L9"],
        ["string.concat", "$L4.Content-Length", "$L10"],
        ["create", "$L5", "Object"],
        ["string.concat", "$L0", "$S0.apiUrl", "/b2api/v1/b2_delete_file_version"],
        ["set", "$L5.url", "$L0"],
        ["set", "$L5.method", "POST"],
        ["set", "$L5.requestHeaders", "$L4"],
        ["stream.stringToStream", "$L9", "$L9"],
        ["set", "$L5.requestBody", "$L9"],
        ["http.requestCall", "$L6", "$L5"],
        ["callFunc", "checkHttpErrors", "$P0", "$L6", "authentication", 200]
    ],
    "AdvancedRequestSupporter:advancedRequest": [
        ["create", "$L0", "Object"],
        ["if!=than", "$P2.appendBaseUrl", 0, 3],
        ["callFunc", "checkAuthentication", "$P0"],
        ["string.concat", "$L0.url", "$S0.apiUrl", "$P2.url"],
        ["jumpRel", 1],
        ["set", "$L0.url", "$P2.url"],
        ["set", "$L0.requestHeaders", "$P2.headers"],
        ["set", "$L0.method", "$P2.method"],
        ["set", "$L0.requestBody", "$P2.body"],
        ["if==than", "$L0.requestHeaders", null, 1],
        ["create", "$L0.requestHeaders", "Object"],
        ["if!=than", "$P2.appendAuthorization", 0, 2],
        ["callFunc", "checkAuthentication", "$P0"],
        ["set", "$L0.requestHeaders.Authorization", "$S0.authorizationToken"],
        ["if!=than", "$P2.body", null, 6],
        ["if==than", "$L0.requestHeaders.Content-Length", null, 5],
        ["jumpRel", 1],
        ["if==than", "$L0.requestHeaders.content-length", null, 3],
        ["stream.streamToString", "$L1", "$L0.requestBody"],
        ["size", "$L2", "$L1"],
        ["string.concat", "$L0.requestHeaders.Content-Length", "$L2", ""],
        ["stream.stringToStream", "$L0.requestBody", "$L1"],
        ["http.requestCall", "$L1", "$L0"],
        ["if!=than", "$P2.checkErrors", 0, 1],
        ["callFunc", "checkHttpErrors", "$P0", "$L1", "advancedRequest"],
        ["create", "$P1", "AdvancedRequestResponse"],
        ["set", "$P1.status", "$L1.code"],
        ["set", "$P1.headers", "$L1.responseHeaders"],
        ["set", "$P1.body", "$L1.responseBody"]
    ],
    "getUploadURL": [
        ["create", "$L4", "Object"],
        ["set", "$L4", "application/x-www-form-urlencoded", "Content-Type"],
        ["set", "$L4", "$S0.authorizationToken", "Authorization"],
        ["string.concat", "$L9", "{\"bucketId\":\"", "$P1.identifier", "\"}"],
        ["size", "$L10", "$L9"],
        ["string.concat", "$L4.Content-Length", "$L10"],
        ["create", "$L5", "Object"],
        ["string.concat", "$L0", "$S0.apiUrl", "/b2api/v1/b2_get_upload_url"],
        ["set", "$L5.url", "$L0"],
        ["set", "$L5.method", "POST"],
        ["set", "$L5.requestHeaders", "$L4"],
        ["stream.stringToStream", "$L9", "$L9"],
        ["set", "$L5.requestBody", "$L9"],
        ["http.requestCall", "$L6", "$L5"],
        ["callFunc", "checkHttpErrors", "$P0", "$L6", "authentication", 200],
        ["stream.streamToString", "$L12", "$L6.responseBody"],
        ["json.parse", "$L12", "$L12"],
        ["set", "$S0.uploadURL", "$L12.uploadUrl"],
        ["set", "$S0.uploadAuthorizationToken", "$L12.authorizationToken"]
    ],
    "checkAuthentication": [
        ["if==than", "$S0.authorizationToken", null, 2],
        ["callFunc", "authenticate", "$P0"],
        ["return"]
    ],
    "authenticate": [
        ["create", "$L2", "String"],
        ["create", "$L4", "Object"],
        ["set", "$L4", "application/x-www-form-urlencoded", "Content-Type"],
        ["string.concat", "$L0", "$P0.accountID", ":", "$P0.appKey"],
        ["string.base64encode", "$L0", "$L0"],
        ["string.concat", "$L0", "Basic ", "$L0"],
        ["set", "$L4", "$L0", "Authorization"],
        ["create", "$L5", "Object"],
        ["set", "$L5.url", "https://api.backblazeb2.com/b2api/v1/b2_authorize_account"],
        ["set", "$L5.method", "GET"],
        ["set", "$L5.requestHeaders", "$L4"],
        ["http.requestCall", "$L6", "$L5"],
        ["callFunc", "checkHttpErrors", "$P0", "$L6", "authentication", 200],
        ["stream.streamToString", "$L7", "$L6.responseBody"],
        ["json.parse", "$L8", "$L7"],
        ["set", "$S0.authorizationToken", "$L8.authorizationToken"],
        ["set", "$S0.accountId", "$L8.accountId"],
        ["set", "$S0.apiUrl", "$L8.apiUrl"],
        ["set", "$S0.downloadUrl", "$L8.downloadUrl"],
        ["set", "$S0.minimumPartSize", "$L8.minimumPartSize"]
    ],
    "checkHttpErrors": [
        ["if==than", "$P3", null, 2],
        ["if>=than", "$P1.code", 400, 24],
        ["jumpRel", 1],
        ["if!=than", "$P1.code", "$P3", 22],
        ["json.parse", "$L0", "$P1.responseBody"],
        ["set", "$L2", "$L0.message"],
        ["if==than", "$P1.code", 401, 2],
        ["create", "$L3", "Error", "$L2", "Authentication"],
        ["throwError", "$L3"],
        ["if==than", "$P1.code", 503, 2],
        ["create", "$L3", "Error", "$L2", "ServiceUnavailable"],
        ["throwError", "$L3"],
        ["if==than", "$P1.code", 404, 2],
        ["create", "$L3", "Error", "$L2", "NotFound"],
        ["throwError", "$L3"],
        ["if>=than", "$P1.code", 400, 10],
        ["string.indexOf", "$L4", "$L2", "Invalid bucketId"],
        ["if!=than", "$L4", -1, 2],
        ["create", "$L3", "Error", "The requested bucket could not be found.", "NotFound"],
        ["throwError", "$L3"],
        ["string.indexOf", "$L4", "$L2", "Bucket name is already in use"],
        ["if!=than", "$L4", -1, 2],
        ["create", "$L3", "Error", "The bucket already exists.", "IllegalArgument"],
        ["throwError", "$L3"],
        ["create", "$L3", "Error", "$L2", "Http"],
        ["throwError", "$L3"]
    ],
    "checkNull": [
        ["if==than", "$P1", null, 2],
        ["create", "$L0", "Error", "Parameter should not be null.", "IllegalArgument"],
        ["throwError", "$L0"]
    ],
    "checkBucket": [
        ["callFunc", "checkNull", "$P0", "$P1"],
        ["if==than", "$P1.name", null, 3],
        ["if==than", "$P1.identifier", null, 2],
        ["create", "$L0", "Error", "Bucket name and identifier should not be null.", "IllegalArgument"],
        ["throwError", "$L0"]
    ],
    "checkSize": [
        ["if<than", "$P1", 0, 2],
        ["create", "$L0", "Error", "Size can not be negative.", "IllegalArgument"],
        ["throwError", "$L0"]
    ],
    "arrayToHex": [
        ["size", "$L1", "$P2"],
        ["set", "$L2", 0],
        ["create", "$P1", "String", ""],
        ["get", "$L3", "$P2", "$L2"],
        ["string.format", "$L4", "%02x", "$L3"],
        ["string.concat", "$P1", "$P1", "$L4"],
        ["math.add", "$L2", "$L2", 1],
        ["if>=than", "$L2", "$L1", -5]
    ]
};
var Backblaze = (function () {
    function Backblaze(redirectReceiver, accountID, appKey) {
        this.interpreterStorage = {};
        this.persistentStorage = [{}];
        this.instanceDependencyStorage = {
            redirectReceiver: redirectReceiver
        };
        InitSelfTest_1.InitSelfTest.initTest("Backblaze");
        this.interpreterStorage["accountID"] = accountID;
        this.interpreterStorage["appKey"] = appKey;
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        if (SERVICE_CODE["init"]) {
            ip.callFunctionSync("init", this.interpreterStorage);
        }
    }
    Backblaze.prototype.createBucket = function (bucketName, callback) {
        Statistics_1.Statistics.addCall("Backblaze", "createBucket");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Storage:createBucket", this.interpreterStorage, null, bucketName).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "Backblaze", "createBucket");
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Backblaze.prototype.listBuckets = function (callback) {
        Statistics_1.Statistics.addCall("Backblaze", "listBuckets");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Storage:listBuckets", this.interpreterStorage, null).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "Backblaze", "listBuckets");
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Backblaze.prototype.deleteBucket = function (bucket, callback) {
        Statistics_1.Statistics.addCall("Backblaze", "deleteBucket");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Storage:deleteBucket", this.interpreterStorage, bucket).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "Backblaze", "deleteBucket");
        }).then(function () {
            var res;
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Backblaze.prototype.deleteFile = function (fileName, bucket, callback) {
        Statistics_1.Statistics.addCall("Backblaze", "deleteFile");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Storage:deleteFile", this.interpreterStorage, fileName, bucket).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "Backblaze", "deleteFile");
        }).then(function () {
            var res;
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Backblaze.prototype.getFileMetadata = function (bucket, fileName, callback) {
        Statistics_1.Statistics.addCall("Backblaze", "getFileMetadata");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Storage:getFileMetadata", this.interpreterStorage, null, bucket, fileName).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "Backblaze", "getFileMetadata");
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Backblaze.prototype.listFiles = function (bucket, callback) {
        Statistics_1.Statistics.addCall("Backblaze", "listFiles");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Storage:listFiles", this.interpreterStorage, null, bucket).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "Backblaze", "listFiles");
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Backblaze.prototype.listFilesWithPrefix = function (bucket, prefix, callback) {
        Statistics_1.Statistics.addCall("Backblaze", "listFilesWithPrefix");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Storage:listFilesWithPrefix", this.interpreterStorage, null, bucket, prefix).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "Backblaze", "listFilesWithPrefix");
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Backblaze.prototype.uploadFile = function (bucket, name, stream, size, callback) {
        Statistics_1.Statistics.addCall("Backblaze", "uploadFile");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Storage:upload", this.interpreterStorage, bucket, name, stream, size).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "Backblaze", "uploadFile");
        }).then(function () {
            var res;
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Backblaze.prototype.downloadFile = function (fileName, bucket, callback) {
        Statistics_1.Statistics.addCall("Backblaze", "downloadFile");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Storage:download", this.interpreterStorage, null, fileName, bucket).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "Backblaze", "downloadFile");
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Backblaze.prototype.advancedRequest = function (specification, callback) {
        Statistics_1.Statistics.addCall("Backblaze", "advancedRequest");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("AdvancedRequestSupporter:advancedRequest", this.interpreterStorage, null, specification).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "Backblaze", "advancedRequest");
        }).then(function () {
            var res;
            res = ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    Backblaze.prototype.saveAsString = function () {
        Statistics_1.Statistics.addCall("Backblaze", "saveAsString");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        return ip.saveAsString();
    };
    Backblaze.prototype.loadAsString = function (savedState) {
        Statistics_1.Statistics.addCall("Backblaze", "loadAsString");
        var sandbox = new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage);
        var ip = new Interpreter_1.Interpreter(sandbox);
        ip.loadAsString(savedState);
        this.persistentStorage = sandbox.persistentStorage;
    };
    Backblaze.prototype.resumeLogin = function (executionState, callback) {
        Statistics_1.Statistics.addCall("Backblaze", "resumeLogin");
        var sandbox = new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage);
        sandbox.loadStateFromString(executionState);
        var ip = new Interpreter_1.Interpreter(sandbox);
        ip.resumeFunction("Authenticating:login", this.interpreterStorage).then(function () { return callback(undefined); }, function (err) { return callback(err); });
    };
    return Backblaze;
}());
exports.Backblaze = Backblaze;
