1. С сайта https://pki.gov.kz/get-sdk/ получить SDK 

В ней нам нужны только 2 библиотеки
SDK\SDK 2.0\Java\xmldsig\kalkancrypt-xmldsig-0.5
SDK\SDK 2.0\Java\provider\knca_provider_jce_kalkan-0.7.5

2. Для сборки проекта необходимо:

Версия gradle: 7.2 и java: Версия 17
Подставить библиотеки kalkancrypt из SDK в директорию lib (полный путь NCANode_Auth-master\NCANode\lib)

3. Запуск проекта

3.1 Подготовка к запуску Бэк
В директории бэка создать файл .env
Содержимое енв(
JWT_SECRET=12asdiojf32o
MONGO_URI=mongodb://localhost:27017
PORT=4000
)
скачиваем зависимости 
cd BackEnd (рейтинг бэкэнд)
npm install
npm install axios
запускаем бэк
npm run start

3.2 Подготовка к запуску Фронт
cd FrontEnd
npm install 
npm run start

3.3 NCANode
cd NCANode 
 ./gradlew bootrun
