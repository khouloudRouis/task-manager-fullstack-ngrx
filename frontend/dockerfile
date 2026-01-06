# Stage 1: Build Angular app
FROM node:22.16.0 AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy app
COPY --from=build /app/dist/task-manager-angular18-ngrx/browser/* /usr/share/nginx/html/


EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
