# ---- Stage 1: Build React App ----
FROM node:18 AS build

WORKDIR /app

# Copy only package.json first
COPY package.json ./

# Install dependencies safely
RUN npm install --legacy-peer-deps

# Copy all project files
COPY . .

# Build production-ready static files
RUN npm run build

# ---- Stage 2: Serve with Nginx ----
FROM nginx:alpine

# Copy built files from stage 1
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
