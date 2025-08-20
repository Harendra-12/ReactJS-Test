# Use Nginx as a base image

FROM nginx:alpine

ARG BUILD_NUMBER=0

LABEL build_number=$BUILD_NUMBER

# Remove default nginx static assets

RUN rm -rf /usr/share/nginx/html/*

# Add a very basic index.html

RUN echo '<!DOCTYPE html><html><head><title>Hello</title></head><body><h1>🚀 Frontend is running!</h1></body></html>' \
    > /usr/share/nginx/html/index.html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
