// @ts-nocheck
import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

// import './singUp.css';
function SingUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { siginUp, loadingAuth } = useContext(AuthContext);

  const _handleSubmit = event => {
    event.preventDefault();

    if (email !== '' && password !== '' && name !== '')
      siginUp(email, password, name);
  };

  return (
    <div className="container-center">
      <div className="login">
        <div className="logo-area">
          <img src={logo} alt="Logo sistema" title="logomarca" />
        </div>
        <form onSubmit={_handleSubmit}>
          .
          <input
            type="text"
            name="nome"
            placeholder="seu nome"
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
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
            {loadingAuth ? 'Carregando' : 'Cadastrar'}
          </button>
          <Link to="/">Já tenho uma conta!</Link>
        </form>
      </div>
    </div>
  );
}

export default SingUp;
