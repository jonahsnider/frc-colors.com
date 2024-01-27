# API service Dockerfile

FROM oven/bun:1-alpine as builder

WORKDIR /usr/src/app

# Add files for buildings
ADD ./apps/ ./apps/
ADD package.json bun.lockb turbo.json ./

# Install dependencies
RUN ["bun", "install", "--frozen-lockfile"]

# Compile the API to an executable
RUN ["bun", "run", "build", "--scope api"]

FROM gcr.io/distroless/base-debian12 as app

# Copy the executable from the builder
COPY --from=builder --chmod=0755 /usr/src/app/apps/api/dist/frc-colors /frc-colors

ENV NODE_ENV production
EXPOSE 3000

# Start the executable
CMD ["/frc-colors"]
