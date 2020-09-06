const express   = require('express');
const router    = express.Router();
const auth      = require('../../middleware/auth');
const moment    = require('moment');
const config    = require('config');
const bcrypt    = require('bcryptjs');

const Batida    = require('./../../models/Batida.model');
const Usuario   = require('./../../models/Usuario.model');

//@route    GET api/batidas
//@desc     Rota de Teste
//@access   public
router.get('/', (req, res) => res.send('Rota de Batidas'));

//@route    POST api/batidas
//@desc     Rota de Registro de Batidas - CREATE
//@desc     Manual do Proprio Usuario com Justificativa 
//@access   public
router.post('/', auth, async (req, res) => {

    let { dtHoraBatida, justificativa} = req.body;
    dtHoraBatida = moment(new Date(dtHoraBatida)).utc().format();

    try {
        let batida = new Batida({
            usuarioID: req.usuarioId,
            dtHoraBatida,
            justificativa,
            enderecoIP: req.ip,
            userAgent: req.userAgent
        })
        await batida.save();

        res.status(200).send('Batida registrada com sucesso.');

    } catch (err) {
       console.error(err.message);
       res.status(500).send('Erro na rota bat001');
    }
});

//@route    POST api/batidas
//@desc     Rota de Registro de Batidas - CREATE
//@desc     Automatica do Proprio Usuario sem Justificativa 
//@access   public
router.post('/automatica', async (req, res) => {

    const { email, senha } = req.body;

    try {
        let usuario = await Usuario.findOne({ email });

        if (!usuario) {
            res.status(400).json({ errors: [{ msg: 'Usuário não encontradp' }] });
        }

        const isMatch = await bcrypt.compare(senha, usuario.senha);

        if (!isMatch) {
            res.status(400).json({ errors: [{ msg: 'Credenciais inválidos' }] });
        }
    
        dtHoraBatida = moment().utc().format();

        let batida = new Batida({
            usuarioID: usuario.id,
            dtHoraBatida,
            justificativa: "Automática",
            enderecoIP: req.ip,
            userAgent: req.userAgent
        })
        await batida.save();

        res.status(200).send('Batida registrada com sucesso.');

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Erro na rota bat002');
        }
});


module.exports = router;