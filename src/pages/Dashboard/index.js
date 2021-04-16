// @ts-nocheck
import { useCallback, useContext, useEffect, useState } from 'react';
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

import firebase from '../../services/firebaseConection';
import { AuthContext } from '../../contexts/auth';

import Header from '../../components/Header';
import Title from '../../components/Title';

import './dashboard.css';
import Modal from '../../components/Modal';

const listRef = firebase
  .firestore()
  .collection('calleds')
  .orderBy('created', 'desc');

function Dashboard() {
  const [called, setCalled] = useState([]);
  const [lastDocs, setLastDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [openModalDetail, setOpenModalDetail] = useState(false);
  const [detail, setDetail] = useState({});

  useEffect(() => {
    async function fetchCalleds() {
      try {
        const spanshot = await listRef.limit(5).get();
        _updateState(spanshot);
      } catch (error) {
        setLoading(false);
        setLoadingMore(false);
      }
    }

    fetchCalleds();
  }, []);

  const _updateState = async spanshot => {
    const isCollectionEmpty = spanshot.size === 0;
    const listCalled = [];

    console.log(spanshot);
    if (!isCollectionEmpty) {
      const { docs } = spanshot;

      docs.forEach(doc => {
        const {
          client,
          description,
          userId,
          clientId,
          subject,
          status,
          created
        } = doc.data();
        listCalled.push({
          id: doc.id,
          client,
          description,
          userId,
          clientId,
          subject,
          status,
          created: format(created.toDate(), 'dd/MM/yyyy')
        });
      });

      const lastDoc = docs[docs.length - 1];
      setCalled(calls => [...calls, ...listCalled]);
      setLastDocs(lastDoc);
      setLoading(false);
    } else {
      setIsEmpty(true);
    }

    setLoadingMore(false);
  };

  const _handleMore = async () => {
    setLoadingMore(true);
    const spanshot = await listRef.startAfter(lastDocs).limit(5).get();
    _updateState(spanshot);
  };

  const withoutCalled = () => (
    <div className="container dashboard">
      <span>Nenhum chamado registrado...</span>
      <Link to="/new" className="new">
        <FiPlus size={24} /> Novo Chamado
      </Link>
    </div>
  );

  const _colorBadge = status => {
    switch (status) {
      case 'Aberto':
        return '#5cb85c';
      case 'Progresso':
        return '#996d0a';
      default:
        return '#999';
    }
  };

  const togglePostModal = useCallback(
    item => {
      setOpenModalDetail(!openModalDetail);
      setDetail(item);
    },
    [openModalDetail]
  );

  const listCallend = () => (
    <>
      <Link to="/new" className="new link-called">
        <FiPlus size={24} /> chamandos
      </Link>
      <table>
        <thead>
          <tr>
            <th scope="col">Cliente</th>
            <th scope="col">Assunto</th>
            <th scope="col">Status</th>
            <th scope="col">Cadastrado em</th>
            <th scope="col">#</th>
          </tr>
        </thead>

        <tbody>
          {called.map((item, index) => (
            <tr key={index}>
              <td data-label="Cliente">{item.client}</td>
              <td data-label="Assunto">{item.subject}</td>
              <td data-label="Status">
                <span
                  className="badge"
                  style={{ backgroundColor: _colorBadge(item.status) }}
                >
                  {item.status}
                </span>
              </td>
              <td data-label="Cadastrado">{item.created}</td>
              <td data-label="#">
                <button
                  type="button"
                  className="action"
                  style={{ background: '#3583f6' }}
                  onClick={() => togglePostModal(item)}
                >
                  <FiSearch size={17} color="#fff" />
                </button>

                <Link
                  to={`/new/${item.id}`}
                  className="action"
                  style={{ background: '#f6a935' }}
                >
                  <FiEdit2 size={17} color="#fff" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {loadingMore && (
        <p>
          <div className="loader" />
          Buscando....
        </p>
      )}
      {!loadingMore && !isEmpty && (
        <button type="button" class="btn-more" onClick={_handleMore}>
          Buscar Mais
        </button>
      )}
    </>
  );

  const _renderContent = () => {
    if (loading)
      return (
        <div>
          {' '}
          <div className="loader" /> Buscando chamados....
        </div>
      );
    return called.length === 0 ? withoutCalled() : listCallend();
  };

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Dashboard">
          <FiMessageSquare size={25} />
        </Title>
        {_renderContent()}
        {openModalDetail && (
          <Modal content={detail} type="detail" close={togglePostModal} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
