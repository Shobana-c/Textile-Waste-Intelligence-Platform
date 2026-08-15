# Use official Node.js image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package configurations
COPY package.json .

# Install packages
RUN npm install

# Copy application files
COPY . .

# Expose Vite development port
EXPOSE 3000

# Start Vite dev server with host flag enabled
CMD ["npm", "run", "dev"]
