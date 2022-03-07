# book_service

#启动方式一
SET DEBUG=book-service:* & npm start

#启动方式二
#安装
npm install supervisor -g
#运行
supervisor bin/www
