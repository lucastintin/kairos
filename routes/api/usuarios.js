const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const Usuario = require('./../../models/Usuario.model');

//@route    GET api/usuarios/teste
//@desc     Rota de Teste
//@access   public
router.get('/teste', (req, res) => res.send('Rota de Usuários'));

//@route    POST api/usuarios
//@desc     Rota de Registro de Usuários - CREATE
//@access   public
router.post('/', async (req, res) => {

    const { nome, email, senha } = req.body;

    try {
        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            res.status(400).json({ errors: [{ msg: 'Usuário já cadastrado' }] });
        }

        usuario = new Usuario({
            nome,
            email, 
            senha
        });

        const salt = await bcrypt.genSalt(10);
        usuario.senha = await bcrypt.hash(senha, salt);
        await usuario.save();

        res.status(200).send('Usuário registrado com sucesso.');

    } catch (err) {
       console.error(err.message);
       res.status(500).send('Erro na rota usu001');
    }
});

module.exports = router;