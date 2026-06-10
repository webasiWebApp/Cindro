FROM node:20-alpine

# Install OpenSSL (required by Prisma engine & bcrypt on Alpine)
RUN apk add --no-cache openssl

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy prisma schema then generate client (with correct Alpine binary)
COPY prisma ./prisma/
RUN npx prisma generate

# Copy remaining source code
COPY . .

EXPOSE 5000

# Start server
CMD ["npm", "start"]
