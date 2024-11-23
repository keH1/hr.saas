#!/bin/sh
# Выполняем установку зависимостей, если они еще не установлены
if [ ! -d "node_modules" ]; then
  echo "Устанавливаю зависимости..."
  npm install
else
  echo "Зависимости уже установлены."
fi

# Запускаем приложение
exec npm run dev --host
