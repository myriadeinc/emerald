  # WORKDIR /usr/src/build
  # RUN chmod 777 /usr/src/build
FROM ubuntu:18.04

  # Building final image
  WORKDIR /usr/src/app
  EXPOSE 8088
  EXPOSE 12345
  ENV NODE_ENV "prod"

  RUN apt-get update \
      && apt-get -y install curl gnupg sudo libboost-all-dev git
  
  # Setup for nvm
  RUN mkdir /usr/local/nvm
  ENV NVM_DIR /usr/local/nvm 
  ENV NODE_VERSION v10.17.0
  RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash 
  
  RUN /bin/bash -c "source $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm use --delete-prefix $NODE_VERSION"
  
  ENV NODE_PATH $NVM_DIR/versions/node/$NODE_VERSION/lib/node_modules
  ENV PATH      $NVM_DIR/versions/node/$NODE_VERSION/bin:$PATH

 
  # Install && build app dependencies
  COPY . . 
  RUN rm -rf node_modules
  RUN npm install

  CMD [ "node", "src/main.js" ]

#   RUN chown -R node:node /usr/src/app
#   USER node
#   COPY --from=builder /usr/local/lib /usr/local/lib
#   COPY --from=builder /usr/lib /usr/lib
#   COPY --from=builder /usr/src/build/ /usr/src/app/
 