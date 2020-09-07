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
//@access   private
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

//@route    POST api/batidas/automatica
//@desc     Rota de Registro de Batidas - CREATE
//@desc     Automatica do Proprio Usuario sem Justificativa 
//@access   public
router.post('/automatica', async (req, res) => {

    const { email, senha } = req.body;

    try {
        let usuario = await Usuario.findOne({ email });

        if (!usuario) {
            res.status(400).json({ errors: [{ msg: 'Usuário não encontrado' }] });
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

//@route    POST api/batidas/abono
//@desc     Rota de Registro de Batidas - CREATE
//@desc     Manual de Abono do Usuario pelo RH
//@access   private
router.post('/abono', auth,  async (req, res) => {

    try {
        const gestorId = req.usuarioId;
        let gestor = await Usuario.findById({ _id: gestorId })

        if (gestor.nivel == 1)  {
            return res.status(400).json({ errors: [{ msg: 'Usuário não tem permissão para abonar' }] });
        }

        let { email, dtHoraBatida } = req.body;

        let funcionario = await Usuario.findOne({ email });
        if (!funcionario) {
            res.status(400).json({ errors: [{ msg: 'Email não encontrado' }] });
        }

        dtHoraBatida = moment(new Date(dtHoraBatida)).utc().format();

        let batida = new Batida({
            usuarioID: funcionario.id,
            dtHoraBatida,
            justificativa: `Abono por ${gestor.email}`,
            enderecoIP: req.ip,
            userAgent: req.userAgent
        })
        await batida.save();

        res.status(200).send('Batida registrada com sucesso.');

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro na rota bat003');
    }
});

//@route    GET api/batidas/minhas
//@desc     Rota de Listagem de Batidas - READ
//@access   private
router.get('/minhas', auth,  async (req, res) => {

    try {        
        let batidas = await Batida.find().where('usuarioID').equals(req.usuarioId).sort('dtHoraBatida');

        res.status(200).json({ batidas })

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro na rota bat004');
    }
});

//@route    GET api/batidas/minhas/dia/2020-09-06
//@desc     Rota de Listagem de Batidas por Dia - READ
//@access   private
router.get('/minhas/dia/:dia', auth,  async (req, res) => {

    try {        
        let dia  = req.params.dia + "T00:01:00Z";
        //Corrigir aqui embaixo quando migrar para so servidor
        dia = moment(new Date(dia)).add('3', 'hour'); 
       
        const inicioDia = dia.startOf('day').toISOString();
        const fimDia = dia.endOf('day').toISOString();

        let batidas = await Batida.find({
            usuarioID: req.usuarioId,
            dtHoraBatida: {
                $gte: inicioDia,
                $lt: fimDia
            }
        });

        res.status(200).json({ batidas })

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro na rota bat005');
    }
});

//@route    GET api/batidas/minhas/mes/2020-09
//@desc     Rota de Listagem de Batidas por Mes - READ
//@access   private
router.get('/minhas/mes/:mes', auth,  async (req, res) => {

    try {        
        let mes  = req.params.mes + "T00:01:00Z";
        //Corrigir aqui embaixo quando migrar para so servidor
        mes = moment(new Date(mes)).add('3', 'hour'); 
       
        const inicioMes = mes.startOf('month').toISOString();
        const fimMes = mes.endOf('month').toISOString();

        let batidas = await Batida.find({
            usuarioID: req.usuarioId,
            dtHoraBatida: {
                $gte: inicioMes,
                $lt: fimMes
            }
        });

        res.status(200).json({ batidas })

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro na rota bat006');
    }
});

//@route    POST api/batidas/funcionario/dia
//@desc     Rota de Listagem (Resumo) de Batidas de um Usuário por Dia - READ
//@access   private
router.post('/funcionario/dia', auth,  async (req, res) => {

    try {        
        const gestorId = req.usuarioId;
        let gestor = await Usuario.findById({ _id: gestorId })

        if (gestor.nivel == 1)  {
            return res.status(400).json({ errors: [{ msg: 'Você não tem permissão para ver as batidas desse usuário.' }] });
        }

        let { email, dia } = req.body;


        let funcionario = await Usuario.findOne({ email });
        if (!funcionario) {
            res.status(400).json({ errors: [{ msg: 'Email não encontrado' }] });
        }

        //Corrigir aqui
        dia = moment(new Date(dia)).add('3', 'hour'); 
       
        const inicioDia = dia.startOf('day').toISOString();
        const fimDia = dia.endOf('day').toISOString();

        let batidas = await Batida.find({
            usuarioID: funcionario.id,
            dtHoraBatida: {
                $gte: inicioDia,
                $lt: fimDia
            }
        });

        res.status(200).json({ batidas });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro na rota bat007');
    }
});

//@route    POST api/batidas/funcionario/mes
//@desc     Rota de Listagem (Resumo) de Batidas de um Usuário por Mes - READ
//@access   private
router.post('/funcionario/mes', auth,  async (req, res) => {

    try {        
        const gestorId = req.usuarioId;
        let gestor = await Usuario.findById({ _id: gestorId });

        if (gestor.nivel == 1)  {
            return res.status(400).json({ errors: [{ msg: 'Você não tem permissão para ver as batidas desse usuário.' }] });
        }

        let { email, mes } = req.body;

        let funcionario = await Usuario.findOne({ email });
        if (!funcionario) {
            res.status(400).json({ errors: [{ msg: 'Email não encontrado' }] });
        }

        //Corrigir aqui
        mes = moment(new Date(mes)).add('3', 'hour'); 
       
        const inicioMes = mes.startOf('month').toISOString();
        const fimMes = mes.endOf('month').toISOString();

        let batidas = await Batida.find({
            usuarioID: funcionario.id,
            dtHoraBatida: {
                $gte: inicioMes,
                $lt: fimMes
            }
        });

        res.status(200).json({ batidas });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro na rota bat008');
    }
});


module.exports = router;