/* jshint node: true */
'use strict';

const { name } = require('./package');

module.exports = {
  name,

  contentFor: function(type) {
    let baseURL = process.env.EMBER_CLI_INJECT_LIVE_RELOAD_BASEURL;
    let liveReloadPort = process.env.EMBER_CLI_INJECT_LIVE_RELOAD_PORT;

    if (liveReloadPort && type === 'head') {
      return '<script src="' + baseURL + 'ember-cli-live-reload.js" type="text/javascript"></script>';
    }
  },

  dynamicScript: function() {
    // let liveReloadPort = process.env.EMBER_CLI_INJECT_LIVE_RELOAD_PORT;
    let scriptSrc = process.env.EMBER_CLI_PROXY_LIVE_RELOAD_BASE_URL;
    scriptSrc += 'livereload.js?snipver=1&host=';
    scriptSrc += process.env.EMBER_CLI_PROXY_LIVE_RELOAD_HOST.replace('https://', '').replace('http://', '');
    scriptSrc += '&port=' + process.env.EMBER_CLI_PROXY_LIVE_RELOAD_PROXY_PORT;

    return "(function() {\n " +
           "var src = '" + scriptSrc + "';\n " +
           "var script    = document.createElement('script');\n " +
           "script.type   = 'text/javascript';\n " +
           "script.src    = src;\n " +
           "document.getElementsByTagName('head')[0].appendChild(script);\n" +
           "}());";
  },

  serverMiddleware: function(config) {
    let self = this;
    let app = config.app;
    let options = config.options;
    let proxyOptions = options["proxy-live-reload"] || { host: options.host };
    let portOffset = proxyOptions["port-offset"] || 100;

    if (options.liveReload !== true) { return; }

    if (!proxyOptions.host) {
      console.error('!!!!!!!! EMBER CLI PROXY LIVE RELOAD - Must specify host !!!!!!!'); // eslint-disable-line
    }

    process.env.EMBER_CLI_INJECT_LIVE_RELOAD_PORT = options.liveReloadPort;
    process.env.EMBER_CLI_INJECT_LIVE_RELOAD_BASEURL = options.baseURL; // default is '/'
    process.env.EMBER_CLI_PROXY_LIVE_RELOAD_PROXY_PORT = parseInt(options.liveReloadPort) + parseInt(portOffset);
    process.env.EMBER_CLI_PROXY_LIVE_RELOAD_HOST = proxyOptions.host;

    process.env.EMBER_CLI_PROXY_LIVE_RELOAD_BASE_URL = options.baseURL;

    let liveReloadUrl = options.baseURL + 'ember-cli-live-reload.js';
    app.use(liveReloadUrl, function(request, response, next) {
      response.contentType('application/javascript');
      response.send(self.dynamicScript());
      next();
    });
  }
};
