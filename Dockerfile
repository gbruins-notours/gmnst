# FROM gcr.io/google_appengine/nodejs
FROM node:6.10.0-slim
COPY . /app/

WORKDIR /app

# You have to specify "--unsafe-perm" with npm install
# when running as root. Failing to do this can cause
# install to appear to succeed even if a preinstall
# script fails, and may have other adverse consequences
# as well.
# This command will also cat the npm-debug.log file after the
# build, if it exists.
RUN npm install --production --unsafe-perm || \
((if [ -f npm-debug.log ]; then \
cat npm-debug.log; \
fi) && false)

# Expose the node.js port to the Docker host.
EXPOSE 8000

CMD npm run build && npm run start