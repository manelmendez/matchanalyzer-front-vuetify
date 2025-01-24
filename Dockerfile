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
RUN npm install

# Run server
WORKDIR /projects/matchanalyzer-front-vuetify/

EXPOSE 5173
CMD [ "npm", "run", "build" ]
