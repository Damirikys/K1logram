FROM node:8

COPY . /

RUN npm install
RUN npm run build

EXPOSE 80

CMD npm start
