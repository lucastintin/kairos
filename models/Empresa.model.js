const mongoose = require('mongoose');

const EmpresaSchema = new mongoose.Schema({
    nomeFantasia: {
        type: String,
        required: true
    },
    razaoSocial: {
        type: String,
        required: true
    },
    cnpj :{
        type: String,
        required: true,
        unique: true
    },
    senha: {
        type: String,
        required: true
    },
    emailContato: [{
        type: String,
        required: true
    }],
    funcionarios: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario'
    }],
    habilitado: {
        type: Boolean,
        default: true,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = Empresa = mongoose.model('empresa', EmpresaSchema);