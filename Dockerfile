FROM gcr.io/google_appengine/nodejs
#FROM node:6.10.0-slim
COPY . /app/

WORKDIR /app

#test
#RUN npm install -g node-gyp

# You have to specify "--unsafe-perm" with npm install
# when running as root. Failing to do this can cause
# install to appear to succeed even if a preinstall
# script fails, and may have other adverse consequences
# as well.
# This command will also cat the npm-debug.log file after the
# build, if it exists.
RUN npm install --unsafe-perm || \
  ((if [ -f npm-debug.log ]; then \
      cat npm-debug.log; \
    fi) && false)

RUN npm run build
RUN npm run knex:migrate-seed

# Expose the node.js port to the Docker host.
EXPOSE 8000

CMD npm run start