# Dockerization Proposal for Adam's Stock Site

## 0. Prerequisite: Install Docker on GCP (Ubuntu)

Before building, you need to install Docker on your VM instance. Run these commands:

```bash
# 1. Update and install prerequisites
sudo apt update
sudo apt install -y ca-certificates curl gnupg

# 2. Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# 3. Add the Docker repository
echo \
  "deb [arch=\"$(dpkg --print-architecture)\" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 4. Install Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 5. Enable Docker for your user (so you don't need 'sudo' for docker commands)
sudo usermod -aG docker $USER

# 6. Apply changes (log out and back in, or run this)
newgrp docker
```

## Objective
Containerize the Next.js application to run efficiently on a **GCP e2-micro** instance (2 vCPUs, 1GB RAM) with minimal resource overhead.

## Strategy: Multi-Stage Build & Alpine Linux

We will use a **Multi-Stage Dockerfile** to minimize the final image size. This ensures that development dependencies (like the heavy `node_modules` folder used for building) are discarded, leaving only the production-ready application.

### Key Optimization Steps:
1.  **Base Image:** Use `node:18-alpine` (or `20-alpine`) for the smallest possible OS footprint (~50MB vs ~1GB for standard Ubuntu).
2.  **Standalone Output:** Configure Next.js for "Standalone" output. This automatically traces dependencies and bundles *only* the necessary files, significantly reducing the `node_modules` size.
3.  **Process Management:** Use `dumb-init` in the container to properly handle signals (like Ctrl+C) and avoid zombie processes, which is crucial for stability on low-memory VMs.
4.  **No PM2:** Since Docker itself acts as a process manager (restarting the container if it crashes), we can skip running PM2 *inside* the container to save memory. We will run the lightweight Next.js server directly.

## Proposed Dockerfile

```dockerfile
# 1. Install dependencies only when needed
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 2. Rebuild the source code only when needed
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Enable standalone output for smaller image
ENV NEXT_PRIVATE_STANDALONE=true
RUN npm run build

# 3. Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=80

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone build
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 80

CMD ["node", "server.js"]
```

## Next.js Configuration Change

To make the above efficient, we **must** enable standalone mode in `next.config.js`:

```javascript
module.exports = {
  output: 'standalone',
  // ... existing config
}
```

## Running on GCP (e2-micro)

The app will connect to your host-based MySQL (or external DB) via the environment variables defined in your `.env` file.

### Deployment Commands

1. **Build the image**:
```bash
docker build -t adams-stock-site .
```

2. **Run the container**:
```bash
docker run -d \
  -p 80:80 \
  --restart always \
  --env-file .env \
  --name stock-site \
  adams-stock-site
```

## Benefits
*   **Ram Usage:** The "standalone" build removes massive dev dependencies, keeping memory usage well within e2-micro limits.
*   **Isolation:** The app runs in its own environment without interfering with the host OS.
*   **Speed:** Alpine Linux boots in milliseconds.
*   **Portability:** The exact same container runs on your Mac and the GCP instance.
