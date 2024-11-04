const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer'); // Импортируем multer для обработки файлов

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Массивы для хранения пользователей, резюме и подписанных данных
let users = [];
let resumes = []; 
let signedDataStore = []; 

// Конфигурация multer для загрузки файлов
const upload = multer({ dest: 'uploads/' }); // Папка для хранения загружаемых файлов

// Эндпоинт для регистрации пользователя
app.post('/auth/signup', (req, res) => {
    const { email, phoneNumber, password, cms } = req.body;

    console.log('Полученные данные:', req.body); 

    // Проверки
    if (!email || !phoneNumber || !password) {
        return res.status(400).json({ message: 'Пожалуйста, заполните все поля.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Неправильный формат email.' });
    }

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'Email уже зарегистрирован.' });
    }

    users.push({
        email: email,
        phoneNumber,
        password,
        cms,
    });
    console.log('Текущие пользователи:', users); 

    return res.status(201).json({ message: 'Регистрация прошла успешно!' });
});

// Эндпоинт для обновления пользователя
app.put('/api/users/:email', (req, res) => {
    const { email } = req.params; 
    const { password, about, profileImage, rating, viewed } = req.body;

    const user = users.find(user => user.email === email);

    if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }

    user.password = password !== undefined ? password : user.password;
    user.about = about !== undefined ? about : user.about;
    user.profileImage = profileImage !== undefined ? profileImage : user.profileImage;
    user.rating = rating !== undefined ? rating : user.rating;
    user.viewed = viewed !== undefined ? viewed : user.viewed;

    res.json({ message: 'Пользователь успешно обновлён', user });
});

// Эндпоинт для получения информации о пользователе по email
app.get('/api/users/:email', (req, res) => {
    const { email } = req.params;
    
    const user = users.find(user => user.email === email);
    
    if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }
    
    res.json(user);
});

// Эндпоинт для получения всех пользователей
app.get('/api/users', (req, res) => {
    res.json(users);
});

// Эндпоинт для добавления резюме
app.post('/api/resumes', upload.single('image'), (req, res) => {
    const { firstName, lastName, email, phone, comment, cms } = req.body;

    // Проверка обязательных полей
    if (!firstName || !lastName || !email || !phone || !comment) {
        return res.status(400).json({ message: 'Все поля обязательны для заполнения.' });
    }

    // Проверка формата электронной почты
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Введите корректный адрес электронной почты.' });
    }

    const newResume = {
        id: resumes.length + 1, // Уникальный ID
        firstName,
        lastName,
        email,
        phone,
        comment,
        cms,
        image: req.file ? req.file.path : null, // Путь к изображению
    };

    resumes.push(newResume);

    res.status(201).json({ message: 'Резюме добавлено', resume: newResume });
});

// Эндпоинт для получения всех резюме
app.get('/api/resumes', (req, res) => {
    res.status(200).json(resumes);
});

// Эндпоинт для получения резюме по ID
app.get('/api/resumes/:id', (req, res) => {
    const { id } = req.params; // Получаем ID из параметров запроса
    
    const resume = resumes.find(r => r.id === parseInt(id)); // Ищем резюме по ID
    
    if (!resume) {
        return res.status(404).json({ message: 'Резюме не найдено' });
    }
    
    res.json(resume); // Отправляем данные найденного резюме
});

// Эндпоинт для обновления резюме по ID
app.put('/api/resumes/:id', upload.single('profileImage'), (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, phone, comment, rating } = req.body;

    const resume = resumes.find(r => r.id === parseInt(id)); // Ищем резюме по ID

    if (!resume) {
        return res.status(404).json({ message: 'Резюме не найдено' });
    }

    // Обновляем данные резюме
    resume.firstName = firstName !== undefined ? firstName : resume.firstName;
    resume.lastName = lastName !== undefined ? lastName : resume.lastName;
    resume.email = email !== undefined ? email : resume.email;
    resume.phone = phone !== undefined ? phone : resume.phone;
    resume.comment = comment !== undefined ? comment : resume.comment;
    resume.rating = rating !== undefined ? parseFloat(rating) : resume.rating; // Приводим к числу

    // Обновляем путь к изображению, если оно загружено
    if (req.file) {
        resume.image = req.file.path; // Сохраняем путь к изображению
    }

    res.json({ message: 'Резюме обновлено успешно', resume });
});


// Эндпоинт для записи подписанных данных
app.post('/api/logs', (req, res) => {
    const { base64Data, signedData, signingTime, actionType } = req.body;

    if (!base64Data || !signedData || !signingTime || !actionType) {
        return res.status(400).json({ message: 'Пожалуйста, предоставьте все необходимые поля.' });
    }

    const newSignedData = {
        id: signedDataStore.length + 1, 
        signingTime,
        base64Data,
        signedData,
        actionType, // Добавляем тип действия
    };

    signedDataStore.push(newSignedData);

    res.status(201).json({ message: 'Подписанные данные успешно сохранены', signedData: newSignedData });
});

// Эндпоинт для получения всех логов
app.get('/api/logs', (req, res) => {
    res.status(200).json(signedDataStore);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
