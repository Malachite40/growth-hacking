FROM node:18.18.0

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY ./jobs/package*.json ./

# Install the project dependencies inside the container
RUN yarn

# Copy the rest of the application code into the container
COPY ./jobs .

# Get schema.prisma
COPY ./prisma/schema.prisma schema.prisma

# Generate prisma package
RUN npx prisma generate

# Set the default command to run your application
CMD ["yarn", "start:worker"]

