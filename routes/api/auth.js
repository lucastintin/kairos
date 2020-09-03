const express   = require('express');
const router    = express.Router();
const auth      = require('../../middleware/auth');
const jwt       = require('jsonwebtoken');
const config    = require('config');
const bcrypt    = require('bcryptjs');

//Models
const Usuario = require('../../models/Usuario.model');
//const Empresa = require('../../models/Empresa.model');

//@route    GET api/auth
//@desc     Rota de Teste
//@access   public
router.get('/', auth, async (req, res) =>{

    try {
        const usuario = await Usuario.findById(req.usuarioId).select('-senha');
        res.json({ usuario });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro 001 no Servidor de Autenticação');
    }
});

//@route    POST api/auth/usuario
//@desc     Rota de Login de Usuários
//@access   public
router.post('/usuario', async (req, res) => {

    const { email, senha } = req.body;

    try {
        let usuario = await Usuario.findOne({ email });

        if (!usuario) {
            res.status(400).json({ errors: [{ msg: 'Usuário não cadastrado' }] });
        }

        const isMatch = await bcrypt.compare(senha, usuario.senha);

        if (!isMatch) {
            res.status(400).json({ errors: [{ msg: 'Credenciais inválidos' }] });
        }

        const payload = {
            usuario: {
                id: usuario.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'), 
            { expiresIn: '12h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
       console.error(err.message);
       res.status(500).send('Erro 002 no Servidor de Autenticação');
    }
});

//@route    POST api/auth/empresas
//@desc     Rota de Login de Empresas
//@access   public
router.post('/empresa', async (req, res) => {

    const { email, senha } = req.body;

    try {
        let usuario = '';// await Empresa.findOne({ email });

        if (!usuario) {
            res.status(400).json({ errors: [{ msg: 'Usuário não cadastrado' }] });
        }

        const isMatch = await bcrypt.compare(senha, usuario.senha);

        if (!isMatch) {
            res.status(400).json({ errors: [{ msg: 'Credenciais inválidos' }] });
        }

        const payload = {
            usuario: {
                id: usuario.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'), 
            { expiresIn: '12h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
       console.error(err.message);
       res.status(500).send('Erro 002 no Servidor de Autenticação');
    }
});

module.exports = router;