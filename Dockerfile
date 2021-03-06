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
RUN npm install pm2 -g
RUN adduser --disabled-password appuser
COPY --from=0 /app/package.json /app/package-lock.json /app/processes.json ./
COPY --from=0 /app/dist ./dist
COPY config/ ./config
COPY .env ./.env
RUN chown -R appuser:appuser /app
USER appuser
RUN npm ci
CMD ["pm2-runtime", "processes.json", "--no-daemon"]
