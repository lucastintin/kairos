import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <h1>
                <Link to="/">
                    Kairós
                </Link>
            </h1>
            <ul>
                <li>
                    <Link to="/loginempresa">
                        para Empresa
                    </Link>
                </li>
                <li>
                    <Link to="/login">
                        para Funcionários
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar;