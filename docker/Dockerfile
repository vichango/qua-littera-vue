FROM node:lts

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

WORKDIR /app
EXPOSE 3000

CMD ["npm", "run", "dev"]

ENTRYPOINT ["/entrypoint.sh"]
