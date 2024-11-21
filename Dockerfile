# Sử dụng một image Node.js chính thức làm base
FROM node:14

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Copy toàn bộ mã nguồn vào thư mục làm việc
COPY . .

# Expose cổng mà ứng dụng sẽ chạy
EXPOSE 3000

# Khởi động ứng dụng
CMD ["npm", "start"]
