const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email :{
        type: String,
        required: true,
        unique: true
    },
    senha: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = Usuario = mongoose.model('usuario', UsuarioSchema);