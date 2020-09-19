import React, { Fragment, useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [ formData, setFormData ] = useState({
        email: '',
        senha: '',
    });

    const { email, senha } = formData;

    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value});
    const onSubmit = async e => {
        e.preventDefault();
        try {
            const usuario = {
                email, 
                senha
            };
            const config = {
                headers: {
                    'Content-type': 'application/json'
                }
            };
            const body = JSON.stringify(usuario);

            const res = await axios.post('/api/auth/usuario',body,config);    
            console.log(res.data);

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Fragment>
            <div>
                <h2>Login</h2>
                <form onSubmit={ e => onSubmit(e) }>
                    <input 
                        type="text"
                        placeholder="email"
                        name="email"
                        value={email} 
                        onChange={e => onChange(e) }
                    />
                    <br />
                    <input 
                        type="password"
                        placeholder="Senha"
                        name="senha"
                        value={senha}
                        onChange={e => onChange(e) }
                    />
                    <br />
                    <br />
                    <input type="submit" value="Entrar" />
                </form>
            </div>
        </Fragment>
    )
}

export default Login;