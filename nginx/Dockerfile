# Use the official Nginx image as the base
FROM nginx:1.31.2

# Copy template files
COPY templates/ /etc/nginx/templates/

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port 80 and 443 to the outside world
EXPOSE 80 443

ENTRYPOINT ["/entrypoint.sh"]
