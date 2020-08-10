FROM node:14.4.0
ENV NODE_ENV=development
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:14.4.0
ENV NODE_ENV=production
WORKDIR /app
COPY --from=0 /app/package.json /app/package-lock.json ./
COPY --from=0 /app/dist ./dist
RUN npm install
CMD npm run start:dist
