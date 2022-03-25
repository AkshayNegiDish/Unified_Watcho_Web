var EnveuLayoutManagerService = {

    listAction: function (screenId) {
        if (!screenId)
            screenId = 0;
        var eparams = new Object();
        eparams.screenId = screenId;
        return new EnveuRequestBuilder("screen", "GET", eparams);
    }
}



/* EnveuConfiguration Start*/
function EnveuConfiguration() {
}

EnveuConfiguration.prototype.platform = null;
EnveuConfiguration.prototype.device = null;
EnveuConfiguration.prototype.apiKey = null
EnveuConfiguration.prototype.serviceUrl = null;
EnveuConfiguration.prototype.serviceEnvironment = null;
EnveuConfiguration.prototype.debug = false;

EnveuConfiguration.prototype.setPlatform = function (platform) {
    this.platform = platform;
}

EnveuConfiguration.prototype.setDevice = function (device) {
    this.device = device;
}

EnveuConfiguration.prototype.setApiKey = function (apiKey) {
    this.apiKey = apiKey;
}

EnveuConfiguration.prototype.setServiceUrl = function (serviceUrl) {
    this.serviceUrl = serviceUrl;
}

EnveuConfiguration.prototype.setServiceEnvironment = function (serviceEnvironment) {
    this.serviceEnvironment = serviceEnvironment;
}

EnveuConfiguration.prototype.setDebug = function (debug) {
    this.debug = debug;
}

EnveuConfiguration.prototype.getPlatform = function () {
    return this.platform;
}

EnveuConfiguration.prototype.getDevice = function () {
    return this.device;
}

EnveuConfiguration.prototype.getApiKey = function () {
    return this.apiKey;
}

EnveuConfiguration.prototype.getServiceUrl = function () {
    return this.serviceUrl;
}

EnveuConfiguration.prototype.getServiceEnvironment = function () {
    return this.serviceEnvironment;
}

/* EnveuConfiguration End*/

/**
 * 
 * @param {EnveuConfiguration} config 
 */
function EnveuClient(config) {
    this.init(config);
}

/**
 * @param EnveuConfiguration The Enveu Client - this is the facade through which all service actions should be called.
 */
EnveuClient.prototype.config = null;

EnveuClient.prototype.init = function (config) {
    this.config = config;
}

EnveuClient.prototype.log = function (msg) {
    if (this.config) {
        if (this.config.debug) {
            console.log(msg);
        }
    }
}

function EnveuRequestBuilder(service, enveuHTTPRequestType, data) {
    if (!service)
        return;
    this.service = service;
    this.enveuHTTPRequestType = enveuHTTPRequestType;
    this.data = data;
}

EnveuRequestBuilder.prototype.execute = function (client, callback) {
    if (callback)
        this.completion(callback)

    this.doHttpRequest(client);
}

EnveuRequestBuilder.prototype.completion = function (callback) {
    this.callback = callback;
    return this;
};

/**
 * send the http request.
 * @return 
 */
EnveuRequestBuilder.prototype.doHttpRequest = function (client) {
    var data = this.data;
    var callback = this.callback;
    var url = this.getUrl(client);

    var headers = new Object();
    headers["x-platform"] = client.config.platform;
    headers["x-device"] = client.config.device;
    headers["x-api-key"] = client.config.apiKey;

    client.log('URL: ' + url);
    client.log('Request JSON: ' + JSON.stringify(data));

    //var data = JSON.stringify(json);

    $.ajax({
        type: this.enveuHTTPRequestType,
        url: url,
        headers: headers,
        crossDomain: true,
        data: data,
        contentType: 'application/json',
        dataType: 'json',
        success: function (json) {
            client.log('Response JSON: ' + JSON.stringify(json));
            if (callback && json.responseCode == 2000)
                callback(true, json);
            else
                callback(false, json)
        },
        error: function (responseData, textStatus, errorThrown) {
            if (callback)
                callback(false, responseData);
            else
                throw errorThrown;
        }
    });
};

EnveuRequestBuilder.prototype.getUrl = function (client) {
    var url = client.config.serviceUrl + "/" + client.config.serviceEnvironment;
    url += '/' + this.service;
    return url;
};