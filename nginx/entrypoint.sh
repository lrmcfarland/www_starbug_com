#!/bin/sh
set -e

# Set default for HOLLY_PORT if not provided
export HOLLY_PORT="${HOLLY_PORT:-3000}"

# Determine which template to use based on environment or default to production
TEMPLATE_TYPE="${NGINX_TEMPLATE_TYPE:-production}"

case "$TEMPLATE_TYPE" in
  setup)
    TEMPLATE="/etc/nginx/templates/setup.conf.template"
    ;;
  selfsigned)
    TEMPLATE="/etc/nginx/templates/selfsigned.conf.template"
    ;;
  *)
    TEMPLATE="/etc/nginx/templates/default.conf.template"
    ;;
esac

# Substitute environment variables in the selected template
envsubst '${HOLLY_PORT}' < "$TEMPLATE" > /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g "daemon off;"
