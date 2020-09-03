const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next){
    const token = req.header('x-auth-token');

    if(!token){
        return res.status(401).json({ msg: 'Erro 001 no Token'});
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.usuarioId = decoded.usuario.id;
        next();
    } catch (error) {
        return res.status(401).json({ msg: 'Erro 002 no Token'});
    }

}