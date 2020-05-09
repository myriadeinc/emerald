FROM node:12.18.3-buster
  EXPOSE 8080
  EXPOSE 22345
  EXPOSE 9878
  WORKDIR /usr/src/app
  COPY package*.json ./

  RUN apt-get -qq update && \
  apt-get install libc6-dev && \
  apt-get -qq install -y \
  libboost-all-dev \
  libsodium-dev \
  libsodium23 

  COPY . .
  # Install early to catch any potential errors
  RUN npm install https://github.com/myriadeinc/cryptonote-lib.git
  RUN npm install --no-optional --quiet

  # USER node
  CMD ["node", "src/main.js"]