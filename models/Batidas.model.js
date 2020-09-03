const mongoose = require('mongoose');

const BatidaSchema = new mongoose.Schema({
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