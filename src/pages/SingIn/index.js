// @ts-nocheck
import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

import './singIn.css';
function SingIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { singIn, loadingAuth } = useContext(AuthContext);

  const _handleSubmit = event => {
    event.preventDefault();
    if (email !== '' && password !== '') singIn(email, password);
  };

  return (
    <div className="container-center">
      <div className="login">
        <div className="logo-area">
          <img src={logo} alt="Logo sistema" title="logomarca" />
        </div>
        <form onSubmit={_handleSubmit}>
          <input
            type="text"
            name="email"
            placeholder="email@exemple.com"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
          />
          <input
            type="text"
            name="password"
            placeholder="email@exemple.com"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
          <button type="submit">
            {' '}
            {loadingAuth ? 'Carregando...' : 'Criar uma conta'}
          </button>
          <Link to="/register">Já tenho uma conta!</Link>
        </form>
      </div>
    </div>
  );
}

export default SingIn;
