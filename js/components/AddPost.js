window.AddPost = ({ onCancel, onSubmit }) => {
  const { useState } = React;
  const [title, setTitle] = useState("");
  const [friend, setFriend] = useState(window.FRIENDS[0]);
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação básica
    if (!body.trim()) {
      alert("O conteúdo da pérola não pode estar vazio.");
      return;
    }

    setIsSubmitting(true);
    // Simula um pequeno delay para dar feedback visual no botão
    await new Promise((resolve) => setTimeout(resolve, 300));

    await onSubmit({ title, body, friend });
    setIsSubmitting(false);
  };

  // Fecha o modal se clicar fora dele (no overlay)
  const handleOverlayClick = (e) => {
    if (e.target.className === "modal-overlay") {
      onCancel();
    }
  };

  return (
    // O overlay cobre a tela inteira
    <div className="modal-overlay" onClick={handleOverlayClick}>
      {/* A janela do modal estilo macOS */}
      <div className="mac-modal" onClick={(e) => e.stopPropagation()}>
        {/* Cabeçalho com título centralizado */}
        <div className="mac-modal-header">
          <h5 className="mac-modal-title">Adicionar Nova Pérola</h5>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mac-modal-body">
            {/* Título (Opcional) */}
            <div className="mb-3">
              <label htmlFor="postTitle" className="form-label">
                Título (Opcional)
              </label>
              <input
                type="text"
                className="form-control"
                id="postTitle"
                placeholder="Ex: Aquele momento..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Seleção do Autor */}
            <div className="mb-3">
              <label htmlFor="postFriend" className="form-label">
                Quem disse?
              </label>
              <select
                className="form-select"
                id="postFriend"
                value={friend}
                onChange={(e) => setFriend(e.target.value)}
              >
                {window.FRIENDS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Conteúdo */}
            <div className="mb-3">
              <label htmlFor="postBody" className="form-label">
                A Pérola *
              </label>
              <textarea
                className="form-control"
                id="postBody"
                rows="5"
                placeholder="O que foi dito..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              ></textarea>
            </div>
          </div>

          {/* Rodapé com ações alinhadas à direita */}
          <div className="mac-modal-footer">
            <button
              type="button"
              className="btn mac-btn mac-btn-secondary cursor-pointer"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn mac-btn mac-btn-primary cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Salvar Pérola"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
