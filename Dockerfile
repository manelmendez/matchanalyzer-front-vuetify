FROM node:23-alpine

# setting up MatchAnalyzer
ARG environment
RUN echo "environment: $environment"
RUN apk add --no-cache g++ make python3
# set work directory on Docker
WORKDIR /projects/matchanalyzer-front-vuetify

# Copy project from Host to Docker
COPY ./ ./

# Install dependencies
RUN npm install && npm run build
# CMD [ "npm", "run", "build" ]
RUN mkdir -p /usr/share/nginx/html && chown -R node:node /usr/share/nginx/html
RUN if [ -d dist ]; then cp -r dist /usr/share/nginx/html; else echo "no existe"; fi
