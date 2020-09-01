const express = require('express');
const connectDB = require('./config/db');

const app = express();
//Conexão com Banco de dados
connectDB();

app.get('/', (req, res) => {
    res.status(200).send('API Rodando');
});

//Rotas da Aplicação
app.use('/api/batidas', require('./routes/api/batidas'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> {
    console.log(`Servidor rodando na porta ${PORT}`);
})