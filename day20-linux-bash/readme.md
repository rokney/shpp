chmod +x /etc/init.d/mynodeapp   // делаем скрипт выполняемым
update-rc.d -n mynodeapp defaults  //прописываем файл в автозагрузку
sudo service mynodeapp start  //запускаем
