const mongoose = require('mongoose');

const BatidaSchema = new mongoose.Schema({
    usuarioID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario'
    },
    dtHoraBatida: {
        type: Date,
        required: true
    },
    justificativa:{
        type:String
    },
    obs:{
        type:String
    },
    enderecoIP: {
        type: String
    },
    userAgent:{
        type: String
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
});

module.exports = Batida = mongoose.model('batida', BatidaSchema);