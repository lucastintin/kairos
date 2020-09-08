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
    setor: {
        type: String
    },
    cargo: {
        type: String
    },
    dtAdmissao: {
        type: Date
    },
    nivel: {
        type: Number,
        default: 1
    },
    batidasPonto: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'batida'
    }],
    empresaID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'empresa'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = Usuario = mongoose.model('usuario', UsuarioSchema);