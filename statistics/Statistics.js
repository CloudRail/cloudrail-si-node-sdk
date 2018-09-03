"use strict";
var Settings_1 = require("../Settings");
var Helper_1 = require("../helpers/Helper");
var Promise = require("bluebird");
var InitSelfTest_1 = require("../servicecode/InitSelfTest");
var Interpreter_1 = require("../servicecode/Interpreter");
var Sandbox_1 = require("../servicecode/Sandbox");
var Statistics = (function () {
    function Statistics() {
    }
    Statistics.addCall = function (service, method) {
        var keyMatch = /^[a-f\d]{24}$/i;
        if (!keyMatch.test(Settings_1.Settings.licenseKey))
            throw new Error("A valid CloudRail license key is required. You can get one at https://developers.cloudrail.com");
        Statistics.callSyncPromise = Statistics.callSyncPromise.then(function () {
            function schedule() {
                Statistics.timer = setTimeout(function () {
                    Statistics.sendStatistics();
                    schedule();
                }, Statistics.DELAY);
                Statistics.timer.unref();
            }
            if (!Statistics.timer)
                schedule();
            var calls = Statistics.getMethodCalls(service, method);
            calls["count"]++;
            Statistics.count++;
            if (Statistics.count === Statistics.next) {
                Statistics.next *= 2;
                return Statistics.sendStatistics();
            }
        });
    };
    Statistics.addError = function (service, method) {
        var calls = Statistics.getMethodCalls(service, method);
        calls["error"]++;
    };
    Statistics.sendStatistics = function () {
        Statistics.sendStatSyncPromise = Statistics.sendStatSyncPromise.then(function () {
            if (Statistics.count === 0)
                return;
            var body = {
                data: Statistics.data,
                appKey: Settings_1.Settings.licenseKey,
                platform: Statistics.PLATFORM,
                additionalStats: Statistics.additionalStats
            };
            var promise = Promise.resolve();
            if (Statistics.entryID) {
                body.id = Statistics.entryID;
            }
            else {
                promise = InitSelfTest_1.InitSelfTest.getMac().then(function (mac) {
                    var app = InitSelfTest_1.InitSelfTest.getNameVersion();
                    var client = {
                        mac: mac,
                        os: InitSelfTest_1.InitSelfTest.getOS()
                    };
                    var appHash = Statistics.hashString(JSON.stringify([app.name, app.version]));
                    var clientHash = Statistics.hashString(JSON.stringify([client.mac, client.os]));
                    delete client.mac;
                    body.app = app;
                    body.client = client;
                    body.libraryVersion = Statistics.CR_VERSION;
                    body.appHash = appHash;
                    body.clientHash = clientHash;
                });
            }
            return promise.then(function () {
                return Helper_1.Helper.makeRequest(Statistics.SERVER_URL, { "Content-Type": "application/json" }, Helper_1.Helper.streamify(JSON.stringify(body)), "POST").then(function (res) {
                    if (res.statusCode !== 200)
                        throw Error();
                    return Helper_1.Helper.dumpStream(res);
                }).then(function (resStr) {
                    var obj = JSON.parse(resStr);
                    if (!Statistics.entryID) {
                        Statistics.entryID = obj.id;
                    }
                    if (obj.block) {
                        Settings_1.Settings.block = true;
                    }
                    Statistics.data = {};
                    Statistics.count = 0;
                    clearTimeout(Statistics.timer);
                    Statistics.timer = null;
                });
            }).catch(function (err) { });
        });
        return Statistics.sendStatSyncPromise;
    };
    Statistics.setAdditionalStats = function (key, value) {
        Statistics.additionalStats[key] = value;
    };
    Statistics.getMethodCalls = function (service, method) {
        Statistics.data[service] = Statistics.data[service] || {};
        var callsToService = Statistics.data[service];
        if (!callsToService[method]) {
            callsToService[method] = {
                count: 0,
                error: 0
            };
        }
        return callsToService[method];
    };
    Statistics.hashString = function (str) {
        var SERVICE_CODE = {
            "hashString": [
                ["hash.md5", "$L0", "$P1"],
                ["size", "$L1", "$L0"],
                ["set", "$L2", 0],
                ["set", "$P0", ""],
                ["get", "$L3", "$L0", "$L2"],
                ["string.format", "$L4", "%02X", "$L3"],
                ["string.concat", "$P0", "$P0", "$L4"],
                ["math.add", "$L2", "$L2", 1],
                ["if>=than", "$L2", "$L1", -5]
            ]
        };
        var interpreter = new Interpreter_1.Interpreter(new Sandbox_1.Sandbox(SERVICE_CODE, [], {}));
        interpreter.callFunctionSync("hashString", null, str);
        return interpreter.getParameter(0);
    };
    Statistics.getCRVer = function () {
        var ver;
        try {
            ver = require("../package.json").version;
        }
        catch (err) { }
        return ver ? ver : "?";
    };
    Statistics.CR_VERSION = Statistics.getCRVer();
    Statistics.PLATFORM = "Node.js";
    Statistics.SERVER_URL = "https://developers.cloudrail.com/api/entries";
    Statistics.DELAY = 300000;
    Statistics.data = {};
    Statistics.next = 1;
    Statistics.count = 0;
    Statistics.callSyncPromise = Promise.resolve();
    Statistics.sendStatSyncPromise = Promise.resolve();
    Statistics.additionalStats = {};
    return Statistics;
}());
exports.Statistics = Statistics;
