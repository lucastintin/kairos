const express = require('express');
const { getRounds } = require('bcryptjs');
const router = express.Router();

//@route    GET api/batidas
//@desc     Rota de Teste
//@access   public
router.get('/', (req, res) => res.send('Rota de Batidas'));

module.exports = router;