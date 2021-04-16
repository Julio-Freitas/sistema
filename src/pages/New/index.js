// @ts-nocheck
import { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { FiPlusCircle } from 'react-icons/fi';

import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebaseConection';

import Header from '../../components/Header';
import Title from '../../components/Title';

import './new.css';

export default function New() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const history = useHistory();

  const [customers, setCustomers] = useState([]);
  const [loadCustomers, setLoadCustomers] = useState(true);
  const [customerSelected, setCustomerSelected] = useState(0);
  const [idCustomer, setIdcustomer] = useState(false);

  const [subject, setSubject] = useState('Suporte');
  const [status, setStatus] = useState('Aberto');
  const [description, setDescription] = useState('');

  const loadId = useCallback(
    async list => {
      try {
        const spanshot = await firebase
          .firestore()
          .collection('calleds')
          .doc(id)
          .get();

        const { clientId, description, status, subject } = spanshot.data();
        setSubject(subject);
        setStatus(status);
        setDescription(description);
        const indexClient = list.findIndex(item => item.id === clientId);
        setCustomerSelected(indexClient);
        setIdcustomer(true);
      } catch (error) {
        toast.error('Não foi possível encontrar o chamado para edição!');
        setIdcustomer(false);
      }
    },
    [id]
  );

  useEffect(() => {
    async function fetchCustumers() {
      try {
        const { docs } = await firebase
          .firestore()
          .collection('customers')
          .get();
        const listCustomers = [];
        docs.forEach(doc => {
          listCustomers.push({
            id: doc.id,
            nameFantasy: doc.data().nameFantasy
          });
        });
        if (listCustomers.length === 0) {
          setLoadCustomers(false);
          setCustomers([{ id: '1A', nameFantasy: '' }]);
          return;
        }

        setCustomers(listCustomers);
        setLoadCustomers(false);
        if (!!id) loadId(listCustomers);
      } catch (error) {
        setLoadCustomers(false);
        setCustomers([{ id: '1A', nameFantasy: '' }]);
      }
    }

    fetchCustumers();
  }, [id, loadId]);

  const _handleRegister = event => {
    event.preventDefault();
  };

  const _handleChangeSelect = ({ target }) => setSubject(target.value);

  const _handleRadioChange = ({ target }) => setStatus(target.value);

  const _handleChangeCustomers = ({ target }) =>
    setCustomerSelected(target.value);

  const _handleEditCalled = useCallback(
    async data => {
      try {
        await firebase.firestore().collection('calleds').doc(id).update(data);
        toast.success('Chamado editado com sucesso!');
        resetForm();
        setTimeout(() => history.push('/dashboard'), 2000);
      } catch (error) {
        toast.error('Error ao editar o chamando!');
      }
    },
    [id, history]
  );

  const _handleSubmitRegister = useCallback(
    async event => {
      event.preventDefault();
      try {
        const data = {
          created: new Date(),
          client: customers[customerSelected].nameFantasy,
          clientId: customers[customerSelected].id,
          subject,
          description,
          status,
          userId: user.uid
        };

        if (idCustomer) {
          _handleEditCalled(data);
          return;
        }

        const response = await firebase
          .firestore()
          .collection('calleds')
          .add(data);

        if (response.id) {
          toast.success('Chamado cadastrado com sucesso!');
          resetForm();
        }
      } catch (error) {
        console.log(error);
        toast.error('Error ao cadastrar o chamando!');
      }
    },
    [
      description,
      status,
      subject,
      customerSelected,
      customers,
      user.uid,
      idCustomer,
      _handleEditCalled
    ]
  );

  const resetForm = () => {
    setDescription('');
    setStatus('Aberto');
    setCustomerSelected(0);
    setSubject('');
  };

  return (
    <>
      <Header />
      <div className="content">
        <Title name="Novo Chamado">
          <FiPlusCircle size={25} />
        </Title>

        <div className="container" onSubmit={_handleRegister}>
          <form className="form-profile" onSubmit={_handleSubmitRegister}>
            <label>Cliente</label>
            {loadCustomers ? (
              <input type="text" value="Carregando....." disabled={true} />
            ) : (
              <select
                value={customerSelected}
                onChange={_handleChangeCustomers}
              >
                {customers.map((item, index) => (
                  <option key={item.id} value={index}>
                    {item.nameFantasy}
                  </option>
                ))}
              </select>
            )}

            <label>Assunto</label>
            <select value={subject} onChange={_handleChangeSelect}>
              <option value="Suporte">suporte</option>
              <option value="Visita Tecinica">Visita Tecinica</option>
              <option value="Financeiro">Financeiro</option>
            </select>

            <label>Status</label>
            <div className="status">
              <input
                type="radio"
                name="radio"
                value="Aberto"
                onChange={_handleRadioChange}
                checked={status === 'Aberto'}
              />
              <span>Em Aberto</span>

              <input
                type="radio"
                name="radio"
                value="Progresso"
                onChange={_handleRadioChange}
                checked={status === 'Progresso'}
              />
              <span>Em Progresso</span>

              <input
                type="radio"
                name="radio"
                value="Atendido"
                checked={status === 'Atendido'}
                onChange={_handleRadioChange}
              />
              <span>Atendido</span>
            </div>

            <label>Complemento</label>
            <textarea
              className="textarea"
              placeholder="Descreva seu problma"
              value={description}
              onChange={({ target }) => setDescription(target.value)}
            />

            <button type="submit">Registar</button>
          </form>
        </div>
      </div>
    </>
  );
}
