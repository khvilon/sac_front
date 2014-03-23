Развёртывание
-------------

Пример секции в конфиге Nginx:

```
location /static {
    alias /home/scmz/sac_static/current;
    add_header Cache-Control public;
    break;
}
```

Необходимо добавить строку в файл `mime.types` конфигурации Nginx.

```
text/cache-manifest     appcache;
```

Установите __capistrano__ командой `bundle install` и разверните приложение:

```
cap deploy
```
