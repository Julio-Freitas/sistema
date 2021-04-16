// @ts-nocheck
import { useContext } from 'react';
import { FiHome, FiUsers, FiSettings } from 'react-icons/fi';
import { AuthContext } from '../../contexts/auth';
import avatar from '../../assets/avatar.png';
import { Link } from 'react-router-dom';

import './header.css';

export default function Header() {
  const { user } = useContext(AuthContext);
  return (
    <div className="sidebar">
      <div>
        <img
          src={user.avatarUrl === null ? avatar : user.avatarUrl}
          alt="Foto avatar"
        />
      </div>
      <div className="menu-option">
        <Link to="/dashboard">
          <FiHome size={24} color="#fff" /> Chamados
        </Link>
        <Link to="customers">
          <FiUsers size={24} color="#fff" /> Clientes
        </Link>
        <Link to="/profiler">
          <FiSettings size={24} color="#fff" />
          Configurações
        </Link>
      </div>
    </div>
  );
}
