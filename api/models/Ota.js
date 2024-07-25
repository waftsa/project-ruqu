const mongoose = require('mongoose');
const { Schema, model} = mongoose;

const OtaSchema = new mongoose.Schema({
    nomorUnik: {type: String, required: true},
    username: {type: String, required: true, min: 4},
    phoneNumber: {type: String, required: true, min: 4, max:14},
    password: {type: String, required: true},
});

const OtaModel = model('Ota', OtaSchema);

module.exports = OtaModel;