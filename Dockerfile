FROM node:20 as base

# copied from https://cycle.io/blog/2023/10/containerizing-and-deploying-a-production-remix-app/

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM deps AS builder
WORKDIR /app
COPY . .
RUN npm run build

FROM deps AS prod-deps
WORKDIR /app
RUN npm i --production 

FROM base as runner
WORKDIR /app 
RUN addgroup --system --gid 1001 remix
RUN adduser --system --uid 1001 remix
USER remix 
COPY --from=prod-deps --chown=remix:remix /app/package*.json ./
COPY --from=prod-deps --chown=remix:remix /app/node_modules ./node_modules
COPY --from=builder --chown=remix:remix /app/build ./build
COPY --from=builder --chown=remix:remix /app/public ./public 

ENV HOST=0.0.0.0
ENV PORT=4000

ENTRYPOINT [ "node", "node_modules/.bin/remix-serve", "build/index.js"]
