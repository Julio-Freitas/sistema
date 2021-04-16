import { useState } from 'react';
import { toast } from 'react-toastify';
import { FiUser } from 'react-icons/fi';

import firebase from '../../services/firebaseConection';

import Header from '../../components/Header';
import Title from '../../components/Title';

import './customers.css';

export default function Customers() {
  const [nameFantasy, setNameFantasy] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [address, setAddress] = useState('');

  const _handleSumit = async event => {
    event.preventDefault();
    if (nameFantasy && cnpj && address) {
      await firebase
        .firestore()
        .collection('customers')
        .add({
          nameFantasy,
          cnpj,
          address
        })
        .then(() => {
          setNameFantasy('');
          setCnpj('');
          setAddress('');
          toast.success('Cadastro efetuado com sucesso!');
        })
        .catch(() => toast.error('Error para efetuar o cadstrado'));
    } else {
      toast.warning('Preencha todos os campos!');
    }
  };

  return (
    <>
      <Header />
      <div className="content">
        <Title name="Custumer">
          <FiUser size={25} />
        </Title>
        <div className="container">
          <form className="form-profile customers" onSubmit={_handleSumit}>
            <label>Nome Fantasia</label>
            <input
              type="text"
              placeholder="Nome da empresa"
              value={nameFantasy}
              onChange={({ target }) => setNameFantasy(target.value)}
            />
            <label>CNPJ</label>
            <input
              type="text"
              placeholder="CNPJ"
              value={cnpj}
              onChange={({ target }) => setCnpj(target.value)}
            />

            <label>Endereço</label>
            <input
              type="text"
              placeholder="Endereço"
              value={address}
              onChange={({ target }) => setAddress(target.value)}
            />
            <button type="submit">Cadastrar</button>
          </form>
        </div>
      </div>
    </>
  );
}
