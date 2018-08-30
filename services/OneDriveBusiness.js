"use strict";
var Interpreter_1 = require("../servicecode/Interpreter");
var Sandbox_1 = require("../servicecode/Sandbox");
var Helper_1 = require("../helpers/Helper");
var InitSelfTest_1 = require("../servicecode/InitSelfTest");
var Statistics_1 = require("../statistics/Statistics");
var SERVICE_CODE = {
    "init": [
        ["string.urlEncode", "$P0.redirectUriEncoded", "$P0.redirectUri"],
        ["create", "$P0.paginationCache", "Object"],
        ["create", "$P0.paginationCache.offset", "Number", 0],
        ["create", "$P0.paginationCache.path", "String", "grgerfefrgerhggerger"],
        ["create", "$P0.paginationCache.metaCache", "Array"]
    ],
    "CloudStorage:getUserLogin": [
        ["callFunc", "User:about", "$P0"],
        ["set", "$P1", "$P0.userInfo.emailAddress"]
    ],
    "CloudStorage:getUserName": [
        ["callFunc", "User:about", "$P0"],
        ["set", "$P1", "$P0.userInfo.displayName"]
    ],
    "User:about": [
        ["if!=than", "$P0.userInfo", null, 4],
        ["create", "$L0", "Date"],
        ["math.add", "$L0", "$L0.Time", -1000],
        ["if>than", "$P0.userInfo.lastUpdate", "$L0", 1],
        ["return"],
        ["callFunc", "User:aboutRequest", "$P0"]
    ],
    "User:aboutRequest": [
        ["callFunc", "checkAuth", "$P0", "$L30"],
        ["create", "$L0", "Object"],
        ["string.concat", "$L0.url", "$S0.url", "/drive"],
        ["set", "$L0.method", "GET"],
        ["create", "$L10", "Object"],
        ["string.concat", "$L10.Authorization", "Bearer ", "$S0.accessToken"],
        ["set", "$L10.Accept", "application/json"],
        ["set", "$L0.requestHeaders", "$L10"],
        ["http.requestCall", "$L2", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L2"],
        ["json.parse", "$L3", "$L2.responseBody"],
        ["create", "$P0.userInfo", "Object"],
        ["create", "$L4", "Date"],
        ["set", "$P0.userInfo.lastUpdate", "$L4.Time"],
        ["set", "$P0.userInfo.emailAddress", "$L3.owner.user.email"],
        ["set", "$P0.userInfo.displayName", "$L3.owner.user.displayName"]
    ],
    "uploadSC": [
        ["callFunc", "validatePath", "$P0", "$P1"],
        ["callFunc", "checkNull", "$P0", "$P2"],
        ["callFunc", "checkAuth", "$P0", "$L30"],
        ["set", "$L9", "$P1"],
        ["callFunc", "getParentPath", "$P0", "$L27", "$L9"],
        ["if!=than", "$L27", "/", 4],
        ["callFunc", "checkIfPathExists", "$P0", "$L10", "$L27"],
        ["if==than", "$L10", "false", 2],
        ["create", "$L31", "Error", "Parent path does not exist.", "NotFound"],
        ["throwError", "$L31"],
        ["if<=than", "$P3", 4000000, 4],
        ["callFunc", "simpleUpload", "$P0", "$P1", "$P2", "$P3", "$P4"],
        ["if!=than", "$P5", null, 1],
        ["callFunc", "updateMetadata", "$P0", "$P1", "$P5"],
        ["jumpRel", 3],
        ["callFunc", "chunkedUpload", "$P0", "$P2", "$P1", "$P3", "$P4"],
        ["if!=than", "$P5", null, 1],
        ["callFunc", "updateMetadata", "$P0", "$P1", "$P5"]
    ],
    "downloadSC": [
        ["callFunc", "validatePath", "$P0", "$P2"],
        ["callFunc", "checkAuth", "$P0", "$L30"],
        ["create", "$L0", "Object"],
        ["create", "$L1", "String"],
        ["callFunc", "urlEncode", "$P0", "$L10", "$P2"],
        ["string.concat", "$L1", "$S0.url", "/drive/root:", "$L10", ":/content"],
        ["set", "$L0.url", "$L1"],
        ["set", "$L0.method", "GET"],
        ["create", "$L10", "Object"],
        ["string.concat", "$L10.Authorization", "Bearer ", "$S0.accessToken"],
        ["set", "$L10.Accept", "application/json"],
        ["set", "$L0.requestHeaders", "$L10"],
        ["http.requestCall", "$L3", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L3"],
        ["set", "$P1", "$L3.responseBody"]
    ],
    "moveSC": [
        ["callFunc", "validatePath", "$P0", "$P1"],
        ["callFunc", "validatePath", "$P0", "$P2"],
        ["callFunc", "checkAuth", "$P0", "$L30"],
        ["create", "$L0", "Object"],
        ["create", "$L1", "String"],
        ["create", "$L2", "Object"],
        ["create", "$L3", "Object"],
        ["create", "$L4", "String"],
        ["create", "$L5", "String"],
        ["create", "$L7", "Object"],
        ["set", "$L7.Content-Type", "application/json"],
        ["string.concat", "$L7.Authorization", "Bearer ", "$S0.accessToken"],
        ["callFunc", "urlEncode", "$P0", "$L20", "$P1"],
        ["string.concat", "$L1", "$S0.url", "/drive/root:", "$L20"],
        ["set", "$L22", "$P2"],
        ["set", "$L39", "$P2"],
        ["callFunc", "checkIfPathExists", "$P0", "$L24", "$L22", "$L30"],
        ["if==than", "$L24", "true", 2],
        ["create", "$L25", "Error", "Destination path already exists.", "Http"],
        ["throwError", "$L25"],
        ["callFunc", "getParentPath", "$P0", "$L21", "$L39"],
        ["set", "$L27", "$L21"],
        ["if!=than", "$L27", "/", 4],
        ["callFunc", "checkIfPathExists", "$P0", "$L28", "$L27", "$L30"],
        ["if==than", "$L28", "false", 2],
        ["create", "$L31", "Error", "The parent path of the destination folder doesn't exist.", "NotFound"],
        ["throwError", "$L31"],
        ["callFunc", "getItemNameFromPath", "$P0", "$L23", "$P2"],
        ["callFunc", "getIdByPath", "$P0", "$L22", "$L21"],
        ["set", "$L3.id", "$L22"],
        ["set", "$L2.parentReference", "$L3"],
        ["set", "$L2.name", "$L23"],
        ["json.stringify", "$L5", "$L2"],
        ["callFunc", "byteLength", "$P0", "$L7.Content-Length", "$L5"],
        ["stream.stringToStream", "$L6", "$L5"],
        ["set", "$L0.url", "$L1"],
        ["set", "$L0.method", "PATCH"],
        ["set", "$L0.requestHeaders", "$L7"],
        ["set", "$L0.requestBody", "$L6"],
        ["http.requestCall", "$L8", "$L0"],
        ["if==than", "$L8.code", 400, 2],
        ["create", "$L20", "Error", "Item does not exist", "NotFound"],
        ["throwError", "$L20"],
        ["callFunc", "validateResponse", "$P0", "$L8"]
    ],
    "deleteSC": [
        ["callFunc", "validatePath", "$P0", "$P1"],
        ["callFunc", "checkAuth", "$P0", "$L30"],
        ["create", "$L0", "Object"],
        ["create", "$L1", "String"],
        ["callFunc", "urlEncode", "$P0", "$L5", "$P1"],
        ["string.concat", "$L1", "$S0.url", "/drive/root:", "$L5"],
        ["set", "$L0.url", "$L1"],
        ["set", "$L0.method", "DELETE"],
        ["create", "$L10", "Object"],
        ["string.concat", "$L10.Authorization", "Bearer ", "$S0.accessToken"],
        ["set", "$L0.requestHeaders", "$L10"],
        ["http.requestCall", "$L2", "$L0"],
        ["if==than", "$L2.code", 400, 3],
        ["callFunc", "checkIfPathExists", "$P0", "$L3", "$P1"],
        ["if==than", "$L3", "false", 1],
        ["return"],
        ["callFunc", "validateResponse", "$P0", "$L2"]
    ],
    "copySC": [
        ["callFunc", "validatePath", "$P0", "$P1"],
        ["callFunc", "validatePath", "$P0", "$P2"],
        ["callFunc", "checkAuth", "$P0", "$L30"],
        ["create", "$L0", "Object"],
        ["create", "$L1", "String"],
        ["create", "$L2", "Object"],
        ["create", "$L3", "Object"],
        ["create", "$L4", "String"],
        ["create", "$L5", "String"],
        ["create", "$L7", "Object"],
        ["set", "$L7.Content-Type", "application/json"],
        ["set", "$L7.Prefer", "respond-async"],
        ["string.concat", "$L7.Authorization", "Bearer ", "$S0.accessToken"],
        ["callFunc", "urlEncode", "$P0", "$L20", "$P1"],
        ["string.concat", "$L1", "$S0.url", "/drive/root:", "$L20", ":/copy"],
        ["set", "$L22", "$P2"],
        ["set", "$L39", "$P2"],
        ["callFunc", "checkIfPathExists", "$P0", "$L24", "$L22", "$L30"],
        ["if==than", "$L24", "true", 2],
        ["create", "$L25", "Error", "Destination path already exists.", "Http"],
        ["throwError", "$L25"],
        ["callFunc", "getParentPath", "$P0", "$L21", "$L39"],
        ["set", "$L27", "$L21"],
        ["if!=than", "$L27", "/", 4],
        ["callFunc", "checkIfPathExists", "$P0", "$L28", "$L27", "$L30"],
        ["if==than", "$L28", "false", 2],
        ["create", "$L31", "Error", "The parent path of the destination folder doesn't exist.", "NotFound"],
        ["throwError", "$L31"],
        ["callFunc", "getItemNameFromPath", "$P0", "$L23", "$P2"],
        ["if==than", "$L21", "/", 1],
        ["set", "$L21", ""],
        ["string.concat", "$L4", "/drive/root:", "$L21"],
        ["set", "$L3.path", "$L4"],
        ["set", "$L2.parentReference", "$L3"],
        ["callFunc", "getItemNameFromPath", "$P0", "$L9", "$P1"],
        ["set", "$L2.name", "$L23"],
        ["json.stringify", "$L5", "$L2"],
        ["callFunc", "byteLength", "$P0", "$L7.Content-Length", "$L5"],
        ["stream.stringToStream", "$L6", "$L5"],
        ["set", "$L0.url", "$L1"],
        ["set", "$L0.method", "POST"],
        ["set", "$L0.requestHeaders", "$L7"],
        ["set", "$L0.requestBody", "$L6"],
        ["http.requestCall", "$L8", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L8"]
    ],
    "createFolderSC": [
        ["callFunc", "validatePath", "$P0", "$P1"],
        ["callFunc", "checkAuth", "$P0", "$L30"],
        ["set", "$L9", "$P1"],
        ["callFunc", "getParentPath", "$P0", "$L27", "$P1"],
        ["if!=than", "$L27", "/", 4],
        ["callFunc", "checkIfPathExists", "$P0", "$L10", "$L27"],
        ["if==than", "$L10", "false", 2],
        ["create", "$L31", "Error", "Parent path does not exist.", "NotFound"],
        ["throwError", "$L31"],
        ["callFunc", "checkIfPathExists", "$P0", "$L10", "$L9", "$L30"],
        ["if==than", "$L10", "true", 2],
        ["create", "$L31", "Error", "Folder already exists.", "Http"],
        ["throwError", "$L31"],
        ["create", "$L0", "Object"],
        ["create", "$L1", "String"],
        ["create", "$L2", "String"],
        ["create", "$L3", "String"],
        ["set", "$L15", "$P1"],
        ["set", "$L16", "$P1"],
        ["callFunc", "getParentPath", "$P0", "$L2", "$L15"],
        ["callFunc", "urlEncode", "$P0", "$L20", "$L2"],
        ["callFunc", "getItemNameFromPath", "$P0", "$L3", "$L16"],
        ["if!=than", "$L20", "%2F", 1],
        ["string.concat", "$L20", ":", "$L20", ":"],
        ["string.concat", "$L1", "$S0.url", "/drive/root", "$L20", "/children"],
        ["create", "$L4", "Object"],
        ["set", "$L4.Content-Type", "application/json"],
        ["set", "$L4.Accept", "application/json"],
        ["string.concat", "$L4.Authorization", "Bearer ", "$S0.accessToken"],
        ["create", "$L5", "Object"],
        ["set", "$L5.name", "$L3"],
        ["create", "$L20", "Object"],
        ["set", "$L5.folder", "$L20"],
        ["json.stringify", "$L6", "$L5"],
        ["callFunc", "byteLength", "$P0", "$L4.Content-Length", "$L6"],
        ["stream.stringToStream", "$L7", "$L6"],
        ["set", "$L0.url", "$L1"],
        ["set", "$L0.method", "POST"],
        ["set", "$L0.requestHeaders", "$L4"],
        ["set", "$L0.requestBody", "$L7"],
        ["http.requestCall", "$L8", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L8"]
    ],
    "getMetadataSC": [
        ["callFunc", "validatePath", "$P0", "$P2"],
        ["if==than", "$P2", "/", 2],
        ["create", "$L31", "Error", "You cannot take metadata from the root folder", "IllegalArgument"],
        ["throwError", "$L31"],
        ["callFunc", "checkAuth", "$P0", "$L30"],
        ["callFunc", "getMetadataFromPath", "$P0", "$P1", "$P2", "$L30"]
    ],
    "getChildrenSC": [
        ["callFunc", "validatePath", "$P0", "$P2"],
        ["callFunc", "checkAuth", "$P0", "$L30"],
        ["create", "$L0", "Object"],
        ["create", "$L1", "String"],
        ["callFunc", "urlEncode", "$P0", "$L28", "$P2"],
        ["if!=than", "$L28", "%2F", 1],
        ["string.concat", "$L28", ":", "$L28", ":"],
        ["string.concat", "$L1", "$S0.url", "/drive/root", "$L28"],
        ["string.concat", "$L1", "$L1", "/children"],
        ["set", "$L0.url", "$L1"],
        ["set", "$L0.method", "GET"],
        ["create", "$L10", "Object"],
        ["string.concat", "$L10.Authorization", "Bearer ", "$S0.accessToken"],
        ["set", "$L10.Accept", "application/json"],
        ["set", "$L0.requestHeaders", "$L10"],
        ["create", "$L4", "Object"],
        ["http.requestCall", "$L4", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L4"],
        ["create", "$L5", "Object"],
        ["json.parse", "$L5", "$L4.responseBody"],
        ["set", "$L16", "$L5.value"],
        ["get", "$L15", "$L5", "@odata.nextLink"],
        ["if!=than", "$L15", null, 14],
        ["create", "$L0", "Object"],
        ["set", "$L0.url", "$L15"],
        ["set", "$L0.method", "GET"],
        ["http.requestCall", "$L4", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L4"],
        ["json.parse", "$L5", "$L4.responseBody"],
        ["size", "$L6", "$L5.value"],
        ["create", "$L7", "Number"],
        ["if<than", "$L7", "$L6", 4],
        ["get", "$L8", "$L5.value", "$L7"],
        ["push", "$L16", "$L8"],
        ["math.add", "$L7", "$L7", 1],
        ["jumpRel", -5],
        ["jumpRel", -16],
        ["create", "$L6", "Array"],
        ["create", "$L7", "Number", 0],
        ["create", "$L8", "Number", 0],
        ["size", "$L8", "$L16"],
        ["if<than", "$L7", "$L8", 31],
        ["create", "$L9", "CloudMetaData"],
        ["get", "$L10", "$L16", "$L7"],
        ["if!=than", "$L10.remoteItem", null, 1],
        ["jumpRel", 25],
        ["set", "$L9.Name", "$L10.name"],
        ["set", "$L9.Size", "$L10.size"],
        ["if!=than", "$L10.lastModifiedDateTime", null, 2],
        ["create", "$L20", "Date", "$L10.lastModifiedDateTime"],
        ["set", "$L9.modifiedAt", "$L20.time"],
        ["if!=than", "$L10.fileSystemInfo", null, 5],
        ["create", "$L17", "Object"],
        ["set", "$L17", "$L10.fileSystemInfo"],
        ["if!=than", "$L17.lastModifiedDateTime", null, 2],
        ["create", "$L18", "Date", "$L17.lastModifiedDateTime"],
        ["set", "$L9.contentModifiedAt", "$L18.time"],
        ["if!=than", "$L10.image", null, 4],
        ["get", "$L11", "$L10.image.height"],
        ["get", "$L12", "$L10.image.width"],
        ["create", "$L13", "ImageMetaData", "$L11", "$L12"],
        ["set", "$L10.ImageMetaData", "$L13"],
        ["if==than", "$L10.folder", null, 2],
        ["set", "$L9.Folder", 0],
        ["jumpRel", 1],
        ["set", "$L9.Folder", 1],
        ["if==than", "$P2", "/", 2],
        ["string.concat", "$L9.Path", "$P2", "$L9.Name"],
        ["jumpRel", 1],
        ["string.concat", "$L9.Path", "$P2", "/", "$L9.Name"],
        ["push", "$L6", "$L9"],
        ["math.add", "$L7", "$L7", 1],
        ["jumpRel", -32],
        ["set", "$P1", "$L6"]
    ],
    "getChildrenPage": [
        ["callFunc", "validatePath", "$P0", "$P2"],
        ["callFunc", "checkAuth", "$P0", "$L30"],
        ["create", "$P1", "Array"],
        ["if!=than", "$P0.paginationCache.path", "$P2", 1],
        ["jumpRel", 1],
        ["if<than", "$P3", "$P0.paginationCache.offset", 22],
        ["set", "$P0.paginationCache.path", "$P2"],
        ["set", "$P0.paginationCache.offset", 0],
        ["create", "$P0.paginationCache.metaCache", "Array"],
        ["create", "$L0", "Object"],
        ["create", "$L1", "String"],
        ["callFunc", "urlEncode", "$P0", "$L28", "$P2"],
        ["if!=than", "$P2", "/", 1],
        ["string.concat", "$L28", ":", "$L28", ":"],
        ["string.concat", "$L1", "$S0.url", "/drive/root", "$L28"],
        ["string.concat", "$L1", "$L1", "/children"],
        ["set", "$L0.url", "$L1"],
        ["set", "$L0.method", "GET"],
        ["create", "$L10", "Object"],
        ["string.concat", "$L10.Authorization", "Bearer ", "$S0.accessToken"],
        ["set", "$L10.Accept", "application/json"],
        ["set", "$L0.requestHeaders", "$L10"],
        ["http.requestCall", "$L2", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L2"],
        ["json.parse", "$L3", "$L2.responseBody"],
        ["callFunc", "processRawMeta", "$P0", "$P0.paginationCache.metaCache", "$L3.value", "$P2"],
        ["get", "$P0.paginationCache.cursor", "$L3", "@odata.nextLink"],
        ["jumpRel", -25],
        ["create", "$L0", "Number"],
        ["size", "$L0", "$P0.paginationCache.metaCache"],
        ["math.add", "$L0", "$L0", "$P0.paginationCache.offset"],
        ["if<than", "$P3", "$L0", 14],
        ["math.multiply", "$L1", "$P0.paginationCache.offset", -1],
        ["math.add", "$L1", "$L1", "$P3"],
        ["size", "$L0", "$P1"],
        ["if<than", "$L0", "$P4", 9],
        ["get", "$L2", "$P0.paginationCache.metaCache", "$L1"],
        ["push", "$P1", "$L2"],
        ["math.add", "$L1", "$L1", 1],
        ["size", "$L3", "$P0.paginationCache.metaCache"],
        ["if==than", "$L3", "$L1", 3],
        ["size", "$L4", "$P0.paginationCache.metaCache"],
        ["math.add", "$P3", "$L4", "$P0.paginationCache.offset"],
        ["jumpRel", 2],
        ["jumpRel", -11],
        ["return"],
        ["if==than", "$P0.paginationCache.cursor", null, 1],
        ["return"],
        ["create", "$L0", "Object"],
        ["set", "$L0.url", "$P0.paginationCache.cursor"],
        ["set", "$L0.method", "GET"],
        ["http.requestCall", "$L1", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L1"],
        ["json.parse", "$L2", "$L1.responseBody"],
        ["size", "$L3", "$P0.paginationCache.metaCache"],
        ["math.add", "$P0.paginationCache.offset", "$P0.paginationCache.offset", "$L3"],
        ["create", "$P0.paginationCache.metaCache", "Array"],
        ["callFunc", "processRawMeta", "$P0", "$P0.paginationCache.metaCache", "$L2.value", "$P2"],
        ["get", "$P0.paginationCache.cursor", "$L2", "@odata.nextLink"],
        ["jumpRel", -57]
    ],
    "getAllocation": [
        ["callFunc", "checkAuth", "$P0", "$L20"],
        ["create", "$L0", "Object"],
        ["create", "$L1", "String"],
        ["string.concat", "$L1", "$S0.url", "/drive"],
        ["set", "$L0.url", "$L1"],
        ["set", "$L0.method", "GET"],
        ["create", "$L10", "Object"],
        ["string.concat", "$L10.Authorization", "Bearer ", "$S0.accessToken"],
        ["set", "$L10.Accept", "application/json"],
        ["set", "$L0.requestHeaders", "$L10"],
        ["create", "$L4", "Object"],
        ["http.requestCall", "$L4", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L4"],
        ["create", "$L5", "Object"],
        ["json.parse", "$L5", "$L4.responseBody"],
        ["create", "$L6", "SpaceAllocation"],
        ["set", "$L6.total", "$L5.quota.total"],
        ["set", "$L6.used", "$L5.quota.used"],
        ["set", "$P1", "$L6"]
    ],
    "createShareLink": [
        ["callFunc", "validatePath", "$P0", "$P2"],
        ["if==than", "$P2", "/", 2],
        ["create", "$L2", "Error", "Cannot share root", "IllegalArgument"],
        ["throwError", "$L2"],
        ["callFunc", "checkAuth", "$P0", "$L12"],
        ["set", "$L9", "$P2"],
        ["callFunc", "getParentPath", "$P0", "$L27", "$L9"],
        ["if!=than", "$L27", "/", 4],
        ["callFunc", "checkIfPathExists", "$P0", "$L10", "$L27"],
        ["if==than", "$L10", "false", 2],
        ["create", "$L31", "Error", "Parent path does not exist.", "NotFound"],
        ["throwError", "$L31"],
        ["callFunc", "urlEncode", "$P0", "$L0", "$P2"],
        ["string.concat", "$L1", "$S0.url", "/drive/root:", "$L0", ":/createLink"],
        ["create", "$L3", "Object"],
        ["set", "$L3.type", "view"],
        ["json.stringify", "$L3", "$L3"],
        ["stream.stringToStream", "$L3", "$L3"],
        ["create", "$L7", "Object"],
        ["set", "$L7.Content-Type", "application/json"],
        ["string.concat", "$L7.Authorization", "Bearer ", "$S0.accessToken"],
        ["create", "$L2", "Object"],
        ["set", "$L2.url", "$L1"],
        ["set", "$L2.method", "POST"],
        ["set", "$L2.requestHeaders", "$L7"],
        ["set", "$L2.requestBody", "$L3"],
        ["http.requestCall", "$L4", "$L2"],
        ["callFunc", "validateResponse", "$P0", "$L4"],
        ["create", "$L5", "Object"],
        ["json.parse", "$L5", "$L4.responseBody"],
        ["set", "$P1", "$L5.link.webUrl"]
    ],
    "processRawMeta": [
        ["size", "$L0", "$P2"],
        ["create", "$L1", "Number", 0],
        ["if<than", "$L1", "$L0", 30],
        ["get", "$L10", "$P2", "$L1"],
        ["if!=than", "$L10.remoteItem", null, 1],
        ["jumpRel", 25],
        ["create", "$L9", "CloudMetaData"],
        ["set", "$L9.Name", "$L10.name"],
        ["set", "$L9.Size", "$L10.size"],
        ["if!=than", "$L10.lastModifiedDateTime", null, 2],
        ["create", "$L20", "Date", "$L10.lastModifiedDateTime"],
        ["set", "$L9.modifiedAt", "$L20.time"],
        ["if!=than", "$L10.fileSystemInfo", null, 5],
        ["create", "$L14", "Object"],
        ["set", "$L14", "$L5.fileSystemInfo"],
        ["if!=than", "$L14.lastModifiedDateTime", null, 2],
        ["create", "$L15", "Date", "$L14.lastModifiedDateTime"],
        ["set", "$L9.contentModifiedAt", "$L15.time"],
        ["if!=than", "$L10.image", null, 4],
        ["get", "$L11", "$L10.image.height"],
        ["get", "$L12", "$L10.image.width"],
        ["create", "$L13", "ImageMetaData", "$L11", "$L12"],
        ["set", "$L10.ImageMetaData", "$L13"],
        ["if==than", "$L10.folder", null, 2],
        ["set", "$L9.Folder", 0],
        ["jumpRel", 1],
        ["set", "$L9.Folder", 1],
        ["if==than", "$P3", null, 2],
        ["callFunc", "getPathById", "$P0", "$L14", "$L10.parentReference.id"],
        ["string.concat", "$L9.Path", "$L14", "/", "$L9.Name"],
        ["push", "$P1", "$L9"],
        ["math.add", "$L1", "$L1", 1],
        ["jumpRel", -31]
    ],
    "exists": [
        ["callFunc", "validatePath", "$P0", "$P2"],
        ["callFunc", "checkAuth", "$P0", "$L12"],
        ["callFunc", "checkIfPathExists", "$P0", "$L0", "$P2"],
        ["if==than", "$L0", "true", 2],
        ["set", "$P1", 1],
        ["return"],
        ["set", "$P1", 0]
    ],
    "getThumbnail": [
        ["callFunc", "checkAuth", "$P0"],
        ["callFunc", "validatePath", "$P0", "$P2"],
        ["callFunc", "urlEncode", "$P0", "$L0", "$P2"],
        ["string.concat", "$L1", "$S0.url", "/drive/root:", "$L0"],
        ["create", "$L2", "Object"],
        ["set", "$L2.url", "$L1"],
        ["set", "$L2.method", "GET"],
        ["create", "$L10", "Object"],
        ["string.concat", "$L10.Authorization", "Bearer ", "$S0.accessToken"],
        ["set", "$L10.Accept", "application/json"],
        ["set", "$L2.requestHeaders", "$L10"],
        ["create", "$L3", "Object"],
        ["http.requestCall", "$L3", "$L2"],
        ["callFunc", "validateResponse", "$P0", "$L3"],
        ["json.parse", "$L4", "$L3.responseBody"],
        ["get", "$L0", "$L4.id"],
        ["create", "$L1", "Object"],
        ["string.concat", "$L1.url", "$S0.url", "/drive/items/", "$L0", "/thumbnails/0/medium/content"],
        ["set", "$L1.method", "GET"],
        ["set", "$L1.requestHeaders", "$L10"],
        ["create", "$L2", "Object"],
        ["http.requestCall", "$L2", "$L1"],
        ["if==than", "$L2.code", 404, 1],
        ["return"],
        ["callFunc", "validateResponse", "$P0", "$L2"],
        ["set", "$P1", "$L2.responseBody"]
    ],
    "searchFiles": [
        ["callFunc", "checkNull", "$P0", "$P2"],
        ["if==than", "$P2", "", 2],
        ["create", "$L0", "Error", "The query is not allowed to be empty.", "IllegalArgument"],
        ["throwError", "$L0"],
        ["callFunc", "checkAuth", "$P0"],
        ["create", "$L0", "Object"],
        ["set", "$L0.method", "GET"],
        ["string.concat", "$L0.url", "$S0.url", "/drive/root/search"],
        ["create", "$L1", "Object"],
        ["set", "$L0.requestHeaders", "$L1"],
        ["string.concat", "$L1.Authorization", "Bearer ", "$S0.accessToken"],
        ["set", "$L1.Accept", "application/json"],
        ["string.urlEncode", "$L2", "$P2"],
        ["string.concat", "$L0.url", "$L0.url", "(q='", "$L2", "')"],
        ["http.requestCall", "$L1", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L1"],
        ["json.parse", "$L2", "$L1.responseBody"],
        ["create", "$P1", "Array"],
        ["callFunc", "processRawMeta", "$P0", "$P1", "$L2.value"]
    ],
    "Authenticating:login": [
        ["callFunc", "checkAuth", "$P0", "$L0"]
    ],
    "Authenticating:logout": [
        ["set", "$S0.accessToken", null]
    ],
    "AdvancedRequestSupporter:advancedRequest": [
        ["create", "$L0", "Object"],
        ["create", "$L0.url", "String"],
        ["if!=than", "$P2.appendBaseUrl", 0, 1],
        ["set", "$L0.url", "https://graph.microsoft.com/v1.0"],
        ["string.concat", "$L0.url", "$L0.url", "$P2.url"],
        ["set", "$L0.requestHeaders", "$P2.headers"],
        ["set", "$L0.method", "$P2.method"],
        ["set", "$L0.requestBody", "$P2.body"],
        ["if!=than", "$P2.appendAuthorization", 0, 4],
        ["callFunc", "checkAuth", "$P0"],
        ["if==than", "$L0.requestHeaders", null, 1],
        ["create", "$L0.requestHeaders", "Object"],
        ["string.concat", "$L0.requestHeaders.Authorization", "Bearer ", "$S0.accessToken"],
        ["http.requestCall", "$L1", "$L0"],
        ["if!=than", "$P2.checkErrors", 0, 1],
        ["callFunc", "validateResponse", "$P0", "$L1"],
        ["create", "$P1", "AdvancedRequestResponse"],
        ["set", "$P1.status", "$L1.code"],
        ["set", "$P1.headers", "$L1.responseHeaders"],
        ["set", "$P1.body", "$L1.responseBody"]
    ],
    "checkAuth": [
        ["create", "$L0", "Date"],
        ["if==than", "$S0.accessToken", null, 2],
        ["callFunc", "authenticate", "$P0", "$P1", "accessToken"],
        ["return"],
        ["create", "$L1", "Date"],
        ["set", "$L1.time", "$S0.expireIn"],
        ["if<than", "$L1", "$L0", 2],
        ["callFunc", "authenticate", "$P0", "$P1", "refreshToken"],
        ["return"],
        ["set", "$P1", "$S0.accessToken"]
    ],
    "authenticate": [
        ["create", "$L2", "String"],
        ["string.urlEncode", "$L12", "$P0.clientSecret"],
        ["if==than", "$P2", "accessToken", 32],
        ["string.concat", "$L0", "https://login.microsoftonline.com/common/oauth2/authorize?client_id=", "$P0.clientId", "&response_type=code&redirect_uri=", "$P0.redirectUriEncoded"],
        ["awaitCodeRedirect", "$L1", "$L0", null, "$P0.redirectUri"],
        ["string.concat", "$L2", "client_id=", "$P0.clientId", "&redirect_uri=", "$P0.redirectUriEncoded", "&client_secret=", "$L12", "&code=", "$L1", "&grant_type=authorization_code&resource=https%3A%2F%2Fgraph.microsoft.com%2F"],
        ["stream.stringToStream", "$L3", "$L2"],
        ["create", "$L4", "Object"],
        ["set", "$L4", "application/x-www-form-urlencoded", "Content-Type"],
        ["callFunc", "byteLength", "$P0", "$L4.Content-Length", "$L2"],
        ["create", "$L5", "Object"],
        ["set", "$L5.url", "https://login.microsoftonline.com/common/oauth2/token"],
        ["set", "$L5.method", "POST"],
        ["set", "$L5.requestBody", "$L3"],
        ["set", "$L5.requestHeaders", "$L4"],
        ["http.requestCall", "$L6", "$L5"],
        ["callFunc", "validateResponse", "$P0", "$L6"],
        ["stream.streamToString", "$L7", "$L6.responseBody"],
        ["json.parse", "$L8", "$L7"],
        ["set", "$S0.refreshToken", "$L8.refresh_token"],
        ["create", "$L4", "Object"],
        ["string.concat", "$L4.Authorization", "Bearer ", "$L8.access_token"],
        ["set", "$L4.Accept", "application/json"],
        ["create", "$L5", "Object"],
        ["set", "$L5.url", "https://graph.microsoft.com/v1.0/me/drive/sharepointIds/siteUrl"],
        ["set", "$L5.method", "GET"],
        ["set", "$L5.requestHeaders", "$L4"],
        ["http.requestCall", "$L6", "$L5"],
        ["callFunc", "validateResponse", "$P0", "$L6"],
        ["stream.streamToString", "$L7", "$L6.responseBody"],
        ["json.parse", "$L8", "$L7"],
        ["string.concat", "$L2", "$L8.value", "/_api/v2.0"],
        ["set", "$S0.url", "$L2"],
        ["string.indexOf", "$L2", "$L8.value", "/", 8],
        ["string.substr", "$S0.resource", "$L8.value", 0, "$L2"],
        ["string.concat", "$L2", "client_id=", "$P0.clientId", "&redirect_uri=", "$P0.redirectUriEncoded", "&client_secret=", "$L12", "&refresh_token=", "$S0.refreshToken", "&grant_type=refresh_token&resource=", "$S0.resource"],
        ["stream.stringToStream", "$L3", "$L2"],
        ["create", "$L4", "Object"],
        ["set", "$L4", "application/x-www-form-urlencoded", "Content-Type"],
        ["callFunc", "byteLength", "$P0", "$L4.Content-Length", "$L2"],
        ["create", "$L5", "Object"],
        ["set", "$L5.url", "https://login.microsoftonline.com/common/oauth2/token"],
        ["set", "$L5.method", "POST"],
        ["set", "$L5.requestBody", "$L3"],
        ["set", "$L5.requestHeaders", "$L4"],
        ["http.requestCall", "$L6", "$L5"],
        ["callFunc", "validateResponse", "$P0", "$L6"],
        ["stream.streamToString", "$L7", "$L6.responseBody"],
        ["json.parse", "$L8", "$L7"],
        ["set", "$S0.accessToken", "$L8.access_token"],
        ["set", "$S0.refreshToken", "$L8.refresh_token"],
        ["create", "$L10", "Date"],
        ["math.multiply", "$L9", "$L8.expires_in", 1000],
        ["math.add", "$L9", "$L9", "$L10.time", -60000],
        ["set", "$S0.expireIn", "$L9"],
        ["set", "$P1", "$L8.access_token"]
    ],
    "getParentPath": [
        ["create", "$L0", "Number"],
        ["string.lastIndexOf", "$L0", "$P2", "/"],
        ["if==than", "$L0", 0, 2],
        ["set", "$P1", "/"],
        ["return"],
        ["string.substring", "$P1", "$P2", 0, "$L0"]
    ],
    "checkNull": [
        ["if==than", "$P1", null, 2],
        ["create", "$L0", "Error", "Passed argument is null.", "IllegalArgument"],
        ["throwError", "$L0"]
    ],
    "getItemNameFromPath": [
        ["create", "$L0", "Array"],
        ["create", "$L1", "String"],
        ["string.split", "$L0", "$P2", "/"],
        ["size", "$L2", "$L0"],
        ["math.add", "$L3", "$L2", -1],
        ["get", "$L1", "$L0", "$L3"],
        ["set", "$P1", "$L1"]
    ],
    "getMetadataFromPath": [
        ["create", "$L0", "Object"],
        ["create", "$L1", "String"],
        ["callFunc", "urlEncode", "$P0", "$L10", "$P2"],
        ["string.concat", "$L1", "$S0.url", "/drive/root:", "$L10"],
        ["set", "$L0.url", "$L1"],
        ["set", "$L0.method", "GET"],
        ["create", "$L10", "Object"],
        ["string.concat", "$L10.Authorization", "Bearer ", "$S0.accessToken"],
        ["set", "$L10.Accept", "application/json"],
        ["set", "$L0.requestHeaders", "$L10"],
        ["create", "$L4", "Object"],
        ["http.requestCall", "$L4", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L4"],
        ["create", "$L5", "Object"],
        ["json.parse", "$L5", "$L4.responseBody"],
        ["set", "$P1", "$L5"],
        ["create", "$P1", "CloudMetaData"],
        ["set", "$P1.Name", "$L5.name"],
        ["set", "$P1.Size", "$L5.size"],
        ["if!=than", "$L5.lastModifiedDateTime", null, 2],
        ["create", "$L10", "Date", "$L5.lastModifiedDateTime"],
        ["set", "$P1.modifiedAt", "$L10.time"],
        ["if!=than", "$L5.fileSystemInfo", null, 5],
        ["create", "$L14", "Object"],
        ["set", "$L14", "$L5.fileSystemInfo"],
        ["if!=than", "$L14.lastModifiedDateTime", null, 2],
        ["create", "$L15", "Date", "$L14.lastModifiedDateTime"],
        ["set", "$P1.contentModifiedAt", "$L15.time"],
        ["if==than", "$L5.folder", null, 2],
        ["set", "$P1.Folder", 0],
        ["jumpRel", 1],
        ["set", "$P1.Folder", 1],
        ["if!=than", "$L5.image", null, 4],
        ["get", "$L11", "$L5.image.height"],
        ["get", "$L12", "$L5.image.width"],
        ["create", "$L13", "ImageMetaData", "$L11", "$L12"],
        ["set", "$P1.ImageMetaData", "$L13"],
        ["set", "$P1.Path", "$P2"]
    ],
    "getPathById": [
        ["create", "$L0", "Object"],
        ["string.concat", "$L1", "$S0.url", "/drive/items/", "$P2"],
        ["set", "$L0.url", "$L1"],
        ["set", "$L0.method", "GET"],
        ["create", "$L10", "Object"],
        ["string.concat", "$L10.Authorization", "Bearer ", "$S0.accessToken"],
        ["set", "$L10.Accept", "application/json"],
        ["set", "$L0.requestHeaders", "$L10"],
        ["create", "$L4", "Object"],
        ["http.requestCall", "$L4", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L4"],
        ["create", "$L5", "Object"],
        ["json.parse", "$L5", "$L4.responseBody"],
        ["string.indexOf", "$L6", "$L5.webUrl", "Documents"],
        ["math.add", "$L6", "$L6", 9],
        ["string.substring", "$L7", "$L5.webUrl", "$L6"],
        ["string.urlDecode", "$P1", "$L7"]
    ],
    "getIdByPath": [
        ["create", "$L0", "Object"],
        ["create", "$L1", "String"],
        ["callFunc", "urlEncode", "$P0", "$L10", "$P2"],
        ["string.concat", "$L1", "$S0.url", "/drive/root:", "$L10"],
        ["set", "$L0.url", "$L1"],
        ["set", "$L0.method", "GET"],
        ["create", "$L10", "Object"],
        ["string.concat", "$L10.Authorization", "Bearer ", "$S0.accessToken"],
        ["set", "$L10.Accept", "application/json"],
        ["set", "$L0.requestHeaders", "$L10"],
        ["create", "$L4", "Object"],
        ["http.requestCall", "$L4", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L4"],
        ["create", "$L5", "Object"],
        ["json.parse", "$L5", "$L4.responseBody"],
        ["set", "$P1", "$L5.id"]
    ],
    "checkIfPathExists": [
        ["create", "$L0", "Object"],
        ["create", "$L1", "String"],
        ["callFunc", "urlEncode", "$P0", "$L22", "$P2"],
        ["string.concat", "$L1", "$S0.url", "/drive/root:", "$L22"],
        ["set", "$L0.url", "$L1"],
        ["set", "$L0.method", "GET"],
        ["create", "$L10", "Object"],
        ["string.concat", "$L10.Authorization", "Bearer ", "$S0.accessToken"],
        ["set", "$L10.Accept", "application/json"],
        ["set", "$L0.requestHeaders", "$L10"],
        ["create", "$L4", "Object"],
        ["http.requestCall", "$L4", "$L0"],
        ["if==than", "$L4.code", 200, 2],
        ["set", "$P1", "true"],
        ["jumpRel", 1],
        ["set", "$P1", "false"]
    ],
    "validatePath": [
        ["if==than", "$P1", null, 2],
        ["create", "$L0", "Error", "Path shouldn't be null", "IllegalArgument"],
        ["throwError", "$L0"],
        ["if==than", "$P1", "", 2],
        ["create", "$L0", "Error", "Path should start with '/'.", "IllegalArgument"],
        ["throwError", "$L0"],
        ["create", "$L0", "String"],
        ["string.substr", "$L0", "$P1", 0, 1],
        ["if!=than", "$L0", "/", 2],
        ["create", "$L0", "Error", "Path should start with '/'.", "IllegalArgument"],
        ["throwError", "$L0"],
        ["create", "$L1", "Number"],
        ["size", "$L1", "$P1"],
        ["math.add", "$L1", "$L1", -1],
        ["if!=than", "$L1", 0, 5],
        ["create", "$L2", "String"],
        ["string.substr", "$L2", "$P1", "$L1", 1],
        ["if==than", "$L2", "/", 2],
        ["create", "$L3", "Error", "Path should not end with '/'.", "IllegalArgument"],
        ["throwError", "$L3"]
    ],
    "validateResponse": [
        ["if>=than", "$P1.code", 400, 24],
        ["json.parse", "$L0", "$P1.responseBody"],
        ["if!=than", "$L0.error_codes", null, 2],
        ["set", "$L2", "$L0.error"],
        ["jumpRel", 2],
        ["set", "$L1", "$L0.error"],
        ["set", "$L2", "$L1.message"],
        ["if==than", "$P1.code", 401, 2],
        ["create", "$L3", "Error", "$L2", "Authentication"],
        ["throwError", "$L3"],
        ["if==than", "$P1.code", 400, 2],
        ["create", "$L3", "Error", "$L2", "Http"],
        ["throwError", "$L3"],
        ["if>=than", "$P1.code", 402, 5],
        ["if<=than", "$P1.code", 509, 4],
        ["if!=than", "$P1.code", 503, 3],
        ["if!=than", "$P1.code", 404, 2],
        ["create", "$L3", "Error", "$L2", "Http"],
        ["throwError", "$L3"],
        ["if==than", "$P1.code", 503, 2],
        ["create", "$L3", "Error", "$L2", "ServiceUnavailable"],
        ["throwError", "$L3"],
        ["if==than", "$P1.code", 404, 2],
        ["create", "$L3", "Error", "$L2", "NotFound"],
        ["throwError", "$L3"]
    ],
    "simpleUpload": [
        ["create", "$L0", "Number"],
        ["string.lastIndexOf", "$L0", "$P1", "/"],
        ["if!=than", "$L0", 0, 5],
        ["string.substring", "$L1", "$P1", 0, "$L0"],
        ["callFunc", "checkIfPathExists", "$P0", "$L2", "$L1"],
        ["if==than", "$L2", "false", 2],
        ["create", "$L3", "Error", "Path does not exist.", "NotFound"],
        ["throwError", "$L3"],
        ["create", "$L0", "Object"],
        ["callFunc", "urlEncode", "$P0", "$L10", "$P1"],
        ["string.concat", "$L20", "$S0.url", "/drive/root:", "$L10", ":/content"],
        ["if==than", "$P4", 0, 1],
        ["string.concat", "$L20", "$L20", "?%40name.conflictBehavior=fail"],
        ["set", "$L0.url", "$L20"],
        ["set", "$L0.method", "PUT"],
        ["create", "$L1", "Object"],
        ["string.concat", "$L2", "Bearer ", "$S0.accessToken"],
        ["set", "$L1.Authorization", "$L2"],
        ["set", "$L1.Content-Type", "text/plain"],
        ["set", "$L1.Accept", "application/json"],
        ["string.concat", "$L1.Content-Length", "$P3"],
        ["set", "$L0.requestHeaders", "$L1"],
        ["set", "$L0.requestBody", "$P2"],
        ["http.requestCall", "$L5", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L5"]
    ],
    "chunkedUpload": [
        ["callFunc", "getUploadSessionUrl", "$P0", "$L1", "$P2", "$P4"],
        ["set", "$L10", 4000000],
        ["set", "$L11", -4000000],
        ["stream.makeLimitedStream", "$L0", "$P1", "$L10"],
        ["callFunc", "chunkedStart", "$P0", "$L1", "$L0", "$P3"],
        ["math.add", "$L2", "$P3", "$L11"],
        ["set", "$L5", "$L10"],
        ["if>than", "$L2", "$L10", 7],
        ["stream.makeLimitedStream", "$L3", "$P1", "$L10"],
        ["callFunc", "chunkedAppend", "$P0", "$L3", "$L1", "$L5", "$P3"],
        ["math.add", "$L4", "$L2", "$L11"],
        ["set", "$L2", "$L4"],
        ["math.add", "$L6", "$L5", "$L10"],
        ["set", "$L5", "$L6"],
        ["jumpRel", -8],
        ["callFunc", "chunkedFinish", "$P0", "$P1", "$L1", "$L5", "$P3"]
    ],
    "getUploadSessionUrl": [
        ["create", "$L0", "Object"],
        ["callFunc", "urlEncode", "$P0", "$L15", "$P2"],
        ["string.concat", "$L1", "$S0.url", "/drive/root:", "$L15", ":/createUploadSession"],
        ["create", "$L2", "Object"],
        ["set", "$L2.Content-Type", "application/json"],
        ["set", "$L2.Accept", "application/json"],
        ["string.concat", "$L2.Authorization", "Bearer ", "$S0.accessToken"],
        ["create", "$L3", "Object"],
        ["create", "$L4", "Object"],
        ["callFunc", "getItemNameFromPath", "$P0", "$L5", "$P2"],
        ["set", "$L4.name", "$L5"],
        ["if==than", "$P3", 0, 1],
        ["set", "$L4", "fail", "@name.conflictBehavior"],
        ["set", "$L3.item", "$L4"],
        ["json.stringify", "$L6", "$L3"],
        ["stream.stringToStream", "$L7", "$L6"],
        ["callFunc", "byteLength", "$P0", "$L2.Content-Length", "$L6"],
        ["set", "$L0.url", "$L1"],
        ["set", "$L0.method", "POST"],
        ["set", "$L0.requestBody", "$L7"],
        ["set", "$L0.requestHeaders", "$L2"],
        ["http.requestCall", "$L8", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L8"],
        ["stream.streamToString", "$L9", "$L8.responseBody"],
        ["json.parse", "$L10", "$L9"],
        ["set", "$P1", "$L10.uploadUrl"]
    ],
    "chunkedStart": [
        ["create", "$L0", "Object"],
        ["set", "$L0.url", "$P1"],
        ["set", "$L0.method", "PUT"],
        ["create", "$L1", "Object"],
        ["set", "$L1.Content-Length", "4000000"],
        ["string.concat", "$L10", "bytes ", 0, "-", "3999999", "/", "$P3"],
        ["set", "$L1.Content-Range", "$L10"],
        ["set", "$L0.requestHeaders", "$L1"],
        ["set", "$L0.requestBody", "$P2"],
        ["http.requestCall", "$L3", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L3"]
    ],
    "chunkedAppend": [
        ["create", "$L0", "Object"],
        ["set", "$L0.url", "$P2"],
        ["set", "$L0.method", "PUT"],
        ["create", "$L1", "Object"],
        ["math.add", "$L20", 3999999, "$P3"],
        ["string.concat", "$L21", "bytes ", "$P3", "-", "$L20", "/", "$P4"],
        ["set", "$L1.Content-Length", "4000000"],
        ["set", "$L1.Content-Range", "$L21"],
        ["set", "$L0.requestHeaders", "$L1"],
        ["set", "$L0.requestBody", "$P1"],
        ["http.requestCall", "$L5", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L5"]
    ],
    "chunkedFinish": [
        ["create", "$L0", "Object"],
        ["set", "$L0.url", "$P2"],
        ["set", "$L0.method", "PUT"],
        ["create", "$L1", "Object"],
        ["math.multiply", "$L20", "$P3", -1],
        ["math.add", "$L21", "$P4", "$L20"],
        ["math.add", "$L23", "$P4", -1],
        ["string.concat", "$L22", "bytes ", "$P3", "-", "$L23", "/", "$P4"],
        ["string.concat", "$L21", "$L21"],
        ["set", "$L1.Content-Length", "$L21"],
        ["set", "$L1.Content-Range", "$L22"],
        ["set", "$L0.requestHeaders", "$L1"],
        ["set", "$L0.requestBody", "$P1"],
        ["http.requestCall", "$L5", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L5"]
    ],
    "byteLength": [
        ["stream.stringToStream", "$P1", "$P2"],
        ["stream.streamToData", "$P1", "$P1"],
        ["size", "$P1", "$P1"],
        ["string.concat", "$P1", "$P1"]
    ],
    "urlEncode": [
        ["string.urlEncode", "$L0", "$P2"],
        ["string.split", "$L0", "$L0", "\\+"],
        ["size", "$L1", "$L0"],
        ["create", "$L2", "Number"],
        ["set", "$L2", 0],
        ["create", "$L4", "String"],
        ["if<than", "$L2", "$L1", 7],
        ["get", "$L5", "$L0", "$L2"],
        ["if==than", "$L2", 0, 2],
        ["set", "$L4", "$L5"],
        ["jumpRel", 1],
        ["string.concat", "$L4", "$L4", "%20", "$L5"],
        ["math.add", "$L2", "$L2", 1],
        ["jumpRel", -8],
        ["set", "$P1", "$L4"]
    ],
    "CloudStorage:uploadWithContentModifiedDate": [
        ["callFunc", "checkNull", "$P0", "$P2", "$P5"],
        ["create", "$L0", "Date"],
        ["set", "$L0.time", "$P5"],
        ["set", "$L1", "$L0.rfcTimeUsingFormat2"],
        ["callFunc", "uploadSC", "$P0", "$P1", "$P2", "$P3", "$P4", "$L1"]
    ],
    "updateMetadata": [
        ["create", "$L0", "Object"],
        ["create", "$L1", "String"],
        ["callFunc", "urlEncode", "$P0", "$L2", "$P1"],
        ["string.concat", "$L1", "$P0.baseUrl", "/drive/root:", "$L2"],
        ["set", "$L0.url", "$L1"],
        ["set", "$L0.method", "GET"],
        ["create", "$L10", "Object"],
        ["string.concat", "$L10.Authorization", "Bearer ", "$S0.accessToken"],
        ["set", "$L10.Accept", "application/json"],
        ["set", "$L0.requestHeaders", "$L10"],
        ["create", "$L4", "Object"],
        ["http.requestCall", "$L4", "$L0"],
        ["callFunc", "validateResponse", "$P0", "$L4"],
        ["create", "$L5", "Object"],
        ["json.parse", "$L5", "$L4.responseBody"],
        ["get", "$L3", "$L5.id"],
        ["create", "$L6", "Object"],
        ["string.concat", "$L6.url", "$P0.baseUrl", "/drive/items/", "$L3"],
        ["create", "$L7", "Object"],
        ["create", "$L8", "Object"],
        ["set", "$L8.lastModifiedDateTime", "$P2"],
        ["set", "$L7.fileSystemInfo", "$L8"],
        ["json.stringify", "$L7", "$L7"],
        ["stream.stringToStream", "$L7", "$L7"],
        ["create", "$L9", "Object"],
        ["set", "$L9.Content-Type", "application/json"],
        ["string.concat", "$L9.Authorization", "Bearer ", "$S0.accessToken"],
        ["set", "$L6.method", "PATCH"],
        ["set", "$L6.requestHeaders", "$L9"],
        ["set", "$L6.requestBody", "$L7"],
        ["create", "$L11", "Object"],
        ["http.requestCall", "$L11", "$L6"],
        ["callFunc", "validateResponse", "$P0", "$L11"]
    ]
};
var OneDriveBusiness = (function () {
    function OneDriveBusiness(redirectReceiver, clientId, clientSecret, redirectUri, state) {
        this.interpreterStorage = {};
        this.persistentStorage = [{}];
        this.instanceDependencyStorage = {
            redirectReceiver: redirectReceiver
        };
        InitSelfTest_1.InitSelfTest.initTest("OneDriveBusiness");
        this.interpreterStorage["clientId"] = clientId;
        this.interpreterStorage["clientSecret"] = clientSecret;
        this.interpreterStorage["redirectUri"] = redirectUri;
        this.interpreterStorage["state"] = state;
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        if (SERVICE_CODE["init"]) {
            ip.callFunctionSync("init", this.interpreterStorage);
        }
    }
    OneDriveBusiness.prototype.download = function (filePath, callback) {
        Statistics_1.Statistics.addCall("OneDriveBusiness", "download");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("downloadSC", this.interpreterStorage, null, filePath).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "OneDriveBusiness", "download");
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
    OneDriveBusiness.prototype.upload = function (filePath, stream, size, overwrite, callback) {
        Statistics_1.Statistics.addCall("OneDriveBusiness", "upload");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("uploadSC", this.interpreterStorage, filePath, stream, size, overwrite ? 1 : 0).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "OneDriveBusiness", "upload");
        }).then(function () {
            var res;
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    OneDriveBusiness.prototype.move = function (sourcePath, destinationPath, callback) {
        Statistics_1.Statistics.addCall("OneDriveBusiness", "move");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("moveSC", this.interpreterStorage, sourcePath, destinationPath).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "OneDriveBusiness", "move");
        }).then(function () {
            var res;
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    OneDriveBusiness.prototype.delete = function (filePath, callback) {
        Statistics_1.Statistics.addCall("OneDriveBusiness", "delete");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("deleteSC", this.interpreterStorage, filePath).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "OneDriveBusiness", "delete");
        }).then(function () {
            var res;
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    OneDriveBusiness.prototype.copy = function (sourcePath, destinationPath, callback) {
        Statistics_1.Statistics.addCall("OneDriveBusiness", "copy");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("copySC", this.interpreterStorage, sourcePath, destinationPath).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "OneDriveBusiness", "copy");
        }).then(function () {
            var res;
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    OneDriveBusiness.prototype.createFolder = function (folderPath, callback) {
        Statistics_1.Statistics.addCall("OneDriveBusiness", "createFolder");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("createFolderSC", this.interpreterStorage, folderPath).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "OneDriveBusiness", "createFolder");
        }).then(function () {
            var res;
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    OneDriveBusiness.prototype.getMetadata = function (filePath, callback) {
        Statistics_1.Statistics.addCall("OneDriveBusiness", "getMetadata");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("getMetadataSC", this.interpreterStorage, null, filePath).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "OneDriveBusiness", "getMetadata");
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
    OneDriveBusiness.prototype.getChildren = function (folderPath, callback) {
        Statistics_1.Statistics.addCall("OneDriveBusiness", "getChildren");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("getChildrenSC", this.interpreterStorage, null, folderPath).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "OneDriveBusiness", "getChildren");
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
    OneDriveBusiness.prototype.getChildrenPage = function (path, offset, limit, callback) {
        Statistics_1.Statistics.addCall("OneDriveBusiness", "getChildrenPage");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("getChildrenPage", this.interpreterStorage, null, path, offset, limit).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "OneDriveBusiness", "getChildrenPage");
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
    OneDriveBusiness.prototype.getUserLogin = function (callback) {
        Statistics_1.Statistics.addCall("OneDriveBusiness", "getUserLogin");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("CloudStorage:getUserLogin", this.interpreterStorage, null).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "OneDriveBusiness", "getUserLogin");
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
    OneDriveBusiness.prototype.getUserName = function (callback) {
        Statistics_1.Statistics.addCall("OneDriveBusiness", "getUserName");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("CloudStorage:getUserName", this.interpreterStorage, null).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "OneDriveBusiness", "getUserName");
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
    OneDriveBusiness.prototype.createShareLink = function (path, callback) {
        Statistics_1.Statistics.addCall("OneDriveBusiness", "createShareLink");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("createShareLink", this.interpreterStorage, null, path).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "OneDriveBusiness", "createShareLink");
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
    OneDriveBusiness.prototype.getAllocation = function (callback) {
        Statistics_1.Statistics.addCall("OneDriveBusiness", "getAllocation");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("getAllocation", this.interpreterStorage, null).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "OneDriveBusiness", "getAllocation");
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
    OneDriveBusiness.prototype.exists = function (path, callback) {
        Statistics_1.Statistics.addCall("OneDriveBusiness", "exists");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("exists", this.interpreterStorage, null, path).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "OneDriveBusiness", "exists");
        }).then(function () {
            var res;
            res = !!ip.getParameter(1);
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    OneDriveBusiness.prototype.getThumbnail = function (path, callback) {
        Statistics_1.Statistics.addCall("OneDriveBusiness", "getThumbnail");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("getThumbnail", this.interpreterStorage, null, path).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "OneDriveBusiness", "getThumbnail");
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
    OneDriveBusiness.prototype.search = function (query, callback) {
        Statistics_1.Statistics.addCall("OneDriveBusiness", "search");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("searchFiles", this.interpreterStorage, null, query).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "OneDriveBusiness", "search");
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
    OneDriveBusiness.prototype.login = function (callback) {
        Statistics_1.Statistics.addCall("OneDriveBusiness", "login");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Authenticating:login", this.interpreterStorage).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "OneDriveBusiness", "login");
        }).then(function () {
            var res;
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    OneDriveBusiness.prototype.logout = function (callback) {
        Statistics_1.Statistics.addCall("OneDriveBusiness", "logout");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("Authenticating:logout", this.interpreterStorage).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "OneDriveBusiness", "logout");
        }).then(function () {
            var res;
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    OneDriveBusiness.prototype.uploadWithContentModifiedDate = function (filePath, stream, size, overwrite, contentModifiedDate, callback) {
        Statistics_1.Statistics.addCall("OneDriveBusiness", "uploadWithContentModifiedDate");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("CloudStorage:uploadWithContentModifiedDate", this.interpreterStorage, filePath, stream, size, overwrite ? 1 : 0, contentModifiedDate).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "OneDriveBusiness", "uploadWithContentModifiedDate");
        }).then(function () {
            var res;
            if (callback != null && typeof callback === "function")
                callback(undefined, res);
        }, function (err) {
            if (callback != null && typeof callback === "function")
                callback(err);
        });
    };
    OneDriveBusiness.prototype.advancedRequest = function (specification, callback) {
        Statistics_1.Statistics.addCall("OneDriveBusiness", "advancedRequest");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        ip.callFunction("AdvancedRequestSupporter:advancedRequest", this.interpreterStorage, null, specification).then(function () {
            Helper_1.Helper.checkSandboxError(ip, "OneDriveBusiness", "advancedRequest");
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
    OneDriveBusiness.prototype.saveAsString = function () {
        Statistics_1.Statistics.addCall("OneDriveBusiness", "saveAsString");
        var ip = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage));
        return ip.saveAsString();
    };
    OneDriveBusiness.prototype.loadAsString = function (savedState) {
        Statistics_1.Statistics.addCall("OneDriveBusiness", "loadAsString");
        var sandbox = new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage);
        var ip = new Interpreter_1.Interpreter(sandbox);
        ip.loadAsString(savedState);
        this.persistentStorage = sandbox.persistentStorage;
    };
    OneDriveBusiness.prototype.resumeLogin = function (executionState, callback) {
        Statistics_1.Statistics.addCall("OneDriveBusiness", "resumeLogin");
        var sandbox = new Sandbox_1.Sandbox(SERVICE_CODE, this.persistentStorage, this.instanceDependencyStorage);
        sandbox.loadStateFromString(executionState);
        var ip = new Interpreter_1.Interpreter(sandbox);
        ip.resumeFunction("Authenticating:login", this.interpreterStorage).then(function () { return callback(undefined); }, function (err) { return callback(err); });
    };
    return OneDriveBusiness;
}());
exports.OneDriveBusiness = OneDriveBusiness;
