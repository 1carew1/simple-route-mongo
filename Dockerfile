FROM hypriot/rpi-node:7.4.0
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
EXPOSE 8090
CMD ["npm", "install"]
CMD ["npm", "test"]
CMD ["npm", "run-script", "startProd"]
