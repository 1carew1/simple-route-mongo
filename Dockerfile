FROM hypriot/rpi-node:7.4.0
RUN mkdir -p /app
COPY package.json /app
COPY . /app
EXPOSE 8090
EXPOSE 27017
WORKDIR /app
RUN npm install
CMD ["npm", "run-script", "startProd"]