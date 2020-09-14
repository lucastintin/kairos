import React, { Fragment }  from 'react'

const LoginEmpresa = () => {
    return (
        <Fragment>
            <div>
                <h2>Login Empresa</h2>
                <p>Faça o Login com a conta da Empresa</p>
                <form>
                    <input 
                        type="text"
                        placeholder="CNPJ"
                        name="cnpj"
                    />
                    <br />
                    <input 
                        type="password"
                        placeholder="Senha"
                        name="senha"
                    />
                    <br />
                    <br />
                    <input type="submit" value="Entrar como Empresa" />
                </form>
            </div>
        </Fragment>
    )
}

export default LoginEmpresa
