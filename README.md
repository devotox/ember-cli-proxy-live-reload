[![Ember Observer Score](http://emberobserver.com/badges/ember-cli-proxy-live-reload.svg)](http://emberobserver.com/addons/ember-cli-proxy-live-reload)
[![Build Status](https://travis-ci.org/devotox/ember-cli-proxy-live-reload.svg)](http://travis-ci.org/devotox/ember-cli-proxy-live-reload)
[![Coverage Status](https://codecov.io/gh/devotox/ember-cli-proxy-live-reload/branch/master/graph/badge.svg)](https://codecov.io/gh/devotox/ember-cli-proxy-live-reload)
[![NPM Version](https://badge.fury.io/js/ember-cli-proxy-live-reload.svg)](http://badge.fury.io/js/ember-cli-proxy-live-reload)
[![NPM Downloads](https://img.shields.io/npm/dm/ember-cli-proxy-live-reload.svg)](https://www.npmjs.org/package/ember-cli-proxy-live-reload)
[![Dependency Status](https://david-dm.org/devotox/ember-cli-proxy-live-reload.svg)](https://david-dm.org/devotox/ember-cli-proxy-live-reload)
[![DevDependency Status](https://david-dm.org/devotox/ember-cli-proxy-live-reload/dev-status.svg)](https://david-dm.org/devotox/ember-cli-proxy-live-reload#info=devDependencies)
[![Greenkeeper](https://badges.greenkeeper.io/devotox/ember-cli-proxy-live-reload.svg)](https://greenkeeper.io/)

ember-cli-proxy-live-reload
==============================================================================

A way to inject all meta tags and extra scripts into head tags that can be preprocessed with handlebars

Installation
------------------------------------------------------------------------------

```
ember install ember-cli-proxy-live-reload
```

Usage
------------------------------------------------------------------------------

### nginx conf

Our standard nginx config proxies the script to ember-cli.

When that script is requested, ember-cli will serve up the script in the `dynamicScript` method below, which in turn loads the livereload.js script.

Some nginx config proxies that to ember-cli's live-reload server running in this project on port 37000:

    server {
      listen 80;
      listen 443 ssl;

      server_name something.yourapphost.dev;

      # ...


      location ~ ^/ember-cli-live-reload.js {
          proxy_pass http://localhost:4200 # port where your ember server is running
      }
      location ~ ^/livereload.js {
        proxy_pass http://localhost:37000;
      }

      # ...
    }

livereload.js is requested with query params that cause it to make a
secure websocket connection to your localhost live_reload_server and on
a port 100 greater than 37000 (37100). nginx config terminates SSL
and proxies that to ember-cli's live-reload server:

    server {
      listen 37100 ssl;
      server_name live_reload_server;

      location / {
        proxy_pass http://localhost:37000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
      }
    }

### Ember CLI options

    {
      "port": 4200,

      "live-reload": true,

      "live-reload-port": 37000,

      "proxy-live-reload": {
        "host": "localhost",
        "port-offset": 100
      }
    }

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
