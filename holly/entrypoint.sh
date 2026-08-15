#!/bin/sh
set -e

# Remove the default nginx config and copy our template
rm -f /etc/nginx/conf.d/default.conf
cp /etc/nginx/conf.d/default.conf.template /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g "daemon off;"
