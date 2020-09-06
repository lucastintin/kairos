const mongoose = require('mongoose');

const BatidaSchema = new mongoose.Schema({
    userID:{
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
    createdAt:{
        type:Date,
        default: Date.now
    }
});

module.exports = Batida = mongoose.model('batida', BatidaSchema);