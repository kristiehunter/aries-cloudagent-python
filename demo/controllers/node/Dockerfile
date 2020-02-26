# Base image
FROM node:alpine
WORKDIR /usr/app

# Copy and install dependencies
COPY package.json ./
RUN npm install --quiet

# Copy remaining files
COPY . .

# Start server
CMD ["npm", "run", "start"]