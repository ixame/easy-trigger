
FROM golang:1.24-alpine AS backend-builder
WORKDIR /app
COPY . .
RUN apk add --no-cache \
    gcc \
    musl-dev \
    sqlite-dev
# 假设后端源代码在 server 目录中
RUN go mod download
ENV CGO_ENABLED=1
RUN go build -ldflags="-extldflags=-static" -o main

# 前端构建代码
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY ./frontend/ .
RUN npm install
RUN npm run build

FROM alpine
ENV TZ=Asia/Shanghai
RUN apk add --no-cache tzdata \
    && ln -sf /usr/share/zoneinfo/${TZ} /etc/localtime \
    && echo ${TZ} > /etc/timezone
WORKDIR /app
COPY --from=backend-builder /app/main .
COPY --from=frontend-builder /app/dist ./frontend/dist
COPY ./config.yaml ./config.yaml
EXPOSE 8080
CMD ["./main"]