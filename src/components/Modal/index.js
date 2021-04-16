import './modal.css';
export default function Modal({ content, close, type }) {
  const {
    client,
    description,
    userId,
    clientId,
    subject,
    status,
    created
  } = content;

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

  const _renderModal = () => {
    switch (type) {
      case 'detail':
        return (
          <div className="wrapper-content">
            <h2>Detalhes do chamados</h2>

            <div className="row">
              <span>
                <b>Assunto:</b> <i>{subject}</i>
              </span>
              <span>
                <b>Cadastrado em:</b> <i>{created}</i>
              </span>
            </div>

            <div className="row">
              <span>
                <b>Cliente:</b>
                <i>{client}</i>
              </span>
            </div>

            <div className="row">
              <span
                className="badge"
                style={{ backgroundColor: _colorBadge(status) }}
              >
                <b>Status:</b>
                <i>{status}</i>
              </span>
            </div>

            {description && (
              <div className="row">
                <span>
                  <b>Complemento:</b> <p>{description}</p>
                </span>
              </div>
            )}
          </div>
        );

      default:
        return <h1>Modal nao dedinido</h1>;
    }
  };
  return (
    <div className="modal">
      <div className="container">
        <button type="button" className="close" onClick={close}>
          Voltar
        </button>{' '}
        {_renderModal()}
      </div>
    </div>
  );
}
