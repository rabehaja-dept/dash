# base node image
FROM node:16-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

RUN apt-get update

# Install nginx to do internal routing in the container
RUN apt-get install -y nginx

# @dash-remove-start strapi
# Install psql so we can make sure databases exist on startup
RUN apt-get install -y postgresql-client
# @dash-remove-end

# Install jq for docker-start.sh
RUN apt-get install -y jq

# @dash-remove-start db
# Install openssl for Prisma
RUN apt-get install -y openssl
# @dash-remove-end

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /myapp

ADD package.json package-lock.json ./
# @dash-remove-next-line shopify
COPY patches ./patches/
RUN npm install --production=false

# Setup production node_modules
FROM base as production-deps

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules
ADD package.json package-lock.json ./
RUN npm prune --production

# @dash-remove-start strapi
ADD strapi/package.json strapi/package-lock.json ./strapi/
RUN npm install --production --prefix ./strapi
# @dash-remove-end

# Build the app
FROM base as build

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules
# @dash-remove-next-line strapi
COPY --from=production-deps /myapp/strapi/node_modules /myapp/strapi/node_modules

ADD . .

# @dash-remove-next-line db
RUN npx prisma generate

RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /myapp

COPY --from=production-deps /myapp/node_modules /myapp/node_modules
COPY --from=build /myapp/build /myapp/build
COPY --from=build /myapp/public /myapp/public
COPY --from=build /myapp/storybook-static /myapp/storybook-static
COPY --from=build /myapp/package.json /myapp/package.json
COPY --from=build /myapp/docker-start.sh /myapp/docker-start.sh
# @dash-remove-start db
COPY --from=build /myapp/node_modules/.prisma /myapp/node_modules/.prisma
COPY --from=build /myapp/prisma /myapp/prisma
# @dash-remove-end
# @dash-remove-start strapi
COPY --from=build /myapp/strapi/node_modules /myapp/strapi/node_modules
COPY --from=build /myapp/strapi/package.json /myapp/strapi/package.json
COPY --from=build /myapp/strapi/src /myapp/strapi/src
COPY --from=build /myapp/strapi/build /myapp/strapi/build
COPY --from=build /myapp/strapi/public /myapp/strapi/public
COPY --from=build /myapp/strapi/config /myapp/strapi/config
COPY --from=build /myapp/strapi/favicon.ico /myapp/strapi/favicon.ico
# @dash-remove-end

CMD ["/bin/bash", "./docker-start.sh"]
