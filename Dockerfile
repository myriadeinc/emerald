FROM ubuntu:18.04 as builder

  RUN apt update && apt install -y nodejs npm 

  RUN apt-get install -y libboost-all-dev
  RUN apt-get update && apt-get install -y git
  WORKDIR /usr/src/build
  RUN chmod 777 /usr/src/build

  # Install && build app dependencies
  COPY . . 
  RUN rm -rf node_modules
  RUN npm install

FROM ubuntu:18.04 as app
  # Building final image
  WORKDIR /usr/src/app
  EXPOSE 8088
  EXPOSE 12345
  RUN apt update && apt install -y nodejs libboost-all-dev

#   RUN chown -R node:node /usr/src/app
#   USER node
  ENV NODE_ENV "prod"
#   COPY --from=builder /usr/local/lib /usr/local/lib
#   COPY --from=builder /usr/lib /usr/lib
#   COPY --from=builder /usr/local/lib /usr/local/lib
  COPY --from=builder /usr/src/build/ /usr/src/app/
  CMD [ "node", "src/main.js" ]