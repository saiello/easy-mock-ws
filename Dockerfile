FROM node:12.22.12-buster-slim

VOLUME /etc/mocks
ENV MOCK_PATH=/etc/mocks

ADD src src

CMD ["node", "src/app.js"]