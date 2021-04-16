// @ts-nocheck
import { useContext, useState } from 'react';
import { FiSettings, FiUpload } from 'react-icons/fi';
import { AuthContext } from '../../contexts/auth';

import firebase from '../../services/firebaseConection';

import Header from '../../components/Header';
import Title from '../../components/Title';

import avatarDefault from '../../assets/avatar.png';
import './profiler.css';

export default function Profiler() {
  const { user, signOUt, setUser, storageUser } = useContext(AuthContext);

  const [name, setName] = useState(!!user && user.name);
  const [email, setEmail] = useState(!!user && user.email);
  const [avatar, setAvatar] = useState(() =>
    !!user && !!user.avatarUrl ? user.avatarUrl : avatarDefault
  );
  const [imageAvatar, setImageAvatar] = useState(null);

  const _handleSave = async event => {
    event.preventDefault();

    if (imageAvatar === null && name) {
      try {
        await firebase.firestore().collection('users').doc(user.uid).update({
          name
        });

        const data = { ...user, name };
        setUser(data);
        storageUser(data);
      } catch (error) {
        console.log(error);
      }
    } else if (!!imageAvatar && name) {
      _handleUpload();
    }
  };

  const _handleUpload = async () => {
    try {
      const currentUid = user.uid;
      const refImage = `image/${currentUid}/${imageAvatar.name}`;
      const storage = firebase.storage();

      await storage
        .ref(refImage)
        .put(imageAvatar)
        .then(async () => {
          await storage
            .ref(`image/${currentUid}`)
            .child(imageAvatar.name)
            .getDownloadURL()
            .then(async url => {
              const urlPhoto = url;
              await firebase
                .firestore()
                .collection('users')
                .doc(currentUid)
                .update({
                  avatarUrl: urlPhoto,
                  name
                })
                .then(() => {
                  const data = { ...user, avatarUrl: urlPhoto, name };
                  setUser(data);
                  storageUser(data);
                });
            });
        });
    } catch (error) {
      console.log(error);
    }
  };

  const _handleCheckedImage = file => {
    const accepted = ['image/jpeg', 'image/png'];
    if (accepted.includes(file.type)) {
      setImageAvatar(file);
      setAvatar(URL.createObjectURL(file));
    } else {
      setImageAvatar(null);
      return null;
    }
  };

  const _handlefile = ({ target }) => {
    const file = target.files[0];
    if (file) {
      _handleCheckedImage(file);
    } else {
      console.log('else');
    }
  };

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="HEADER">
          <FiSettings size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={_handleSave}>
            <label className="label-avatar">
              <span>
                <FiUpload size={25} />
              </span>
              <input type="file" accept="image/*" onChange={_handlefile} />{' '}
              <br />
              <img width="250" height="250" src={avatar} alt="Avatar user" />
            </label>

            <label>Nome</label>
            <input
              type="text"
              value={name}
              onChange={({ target }) => setName(target.value)}
            />

            <label>email</label>
            <input
              type="text"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              disabled={true}
            />

            <button type="submit">Salvar</button>
          </form>
        </div>
        <button type="buton" className="button-logout" onClick={signOUt}>
          Sair
        </button>
      </div>
    </div>
  );
}
