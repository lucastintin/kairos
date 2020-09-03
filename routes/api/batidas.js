const express = require('express');
const router = express.Router();
const moment = require('moment');

//@route    GET api/batidas
//@desc     Rota de Teste
//@access   public
router.get('/', (req, res) => res.send('Rota de Batidas'));

//@route    POST api/batidas
//@desc     Rota de Registro de Batidas - CREATE
//@access   public
router.post('/', async (req, res) => {

    const { dtHoraBatida, justificativa} = req.body;
    dtHoraBatida = moment(dtHoraBatida).format();

    try {
        let batida = new Batida({
            dtHoraBatida,
            justificativa
        })
        await batida.save();

        res.status(200).send('Batida registrada com sucesso.');

    } catch (err) {
       console.error(err.message);
       res.status(500).send('Erro na rota bat001');
    }
});

module.exports = router;