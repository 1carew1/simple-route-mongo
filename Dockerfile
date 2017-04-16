FROM hypriot/rpi-node:7.4.0
RUN mkdir -p /home/pi/app
WORKDIR /home/pi/app
COPY package.json /home/pi/app
RUN npm install
COPY . /home/pi/app
EXPOSE 8090
CMD ["npm", "test"]
CMD ["npm", "run-scropt", "startProd"]
