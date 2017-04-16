FROM node:argon
RUN mkdir -p /home/pi/app
WORKDIR /home/pi/app
COPY package.json /home/pi/app
RUN npm install
COPY . /home/pi/app
EXPOSE 8090
CMD ["npm", "start"]
