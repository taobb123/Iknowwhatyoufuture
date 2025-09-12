# Docker配置模板

## Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

## docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - .:/app
```

## 使用说明
1. 创建Dockerfile和docker-compose.yml
2. 构建镜像: `docker build -t my-app .`
3. 运行容器: `docker-compose up`

## 效果
- 容器化应用部署
- 环境一致性保证
- 简化部署流程