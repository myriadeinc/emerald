FROM ubuntu:20.04
  EXPOSE 8080
  EXPOSE 22345
  EXPOSE 9878
  WORKDIR /usr/src/app
  COPY . .
  RUN apt-get -qq update && apt-get install -qq -y tzdata && apt-get install -y libboost-all-dev curl g++ build-essential musl musl-dev git make gcc python python-dev
  RUN ln -s /usr/lib/x86_64-linux-musl/libc.so /lib/libc.musl-x86_64.so.1 

  RUN curl -SL https://deb.nodesource.com/setup_12.x | bash -
  RUN apt-get -qq update && apt-get -qq install --yes nodejs
  RUN npm install --quiet
  CMD ["node", "src/main.js"]