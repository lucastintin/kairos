const express = require('express');
const connectDB = require('./config/db');

const app = express(); 
//Conexão com Banco de dados
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
    res.status(200).send('API Rodando');
});

//Rotas da Aplicação
app.use('/api/batidas', require('./routes/api/batidas'));
app.use('/api/usuarios', require('./routes/api/usuarios'));
app.use('/api/auth', require('./routes/api/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> {
    console.log(`Servidor rodando na porta ${PORT}`);
})