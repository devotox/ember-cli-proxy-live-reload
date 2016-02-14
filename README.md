# ember-cli-proxy-live-reload

When using nginx to terminate SSL and reverse proxy appropriate requests to ember-cli, ember-cli's live-reload will not work out of the box.

This addon implements a proxy configuration for livereload.js and provides a generator for the corresponding nginx conf.

## nginx conf

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

## Ember CLI options

    {
      "port": 4200, 

      "live-reload": true,

      "live-reload-port": 37000,

      "proxy-live-reload": {
        "host": "localhost",
        "port-offset": 100
      }
    }


