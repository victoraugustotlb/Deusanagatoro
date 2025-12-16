const { useState } = React;

window.AddBook = ({ onCancel, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [coverUrl, setCoverUrl] = useState('');
    const [spineUrl, setSpineUrl] = useState('');

    const handleSubmit = () => {
        if (title.trim() && author.trim()) {
            onSubmit({ title, author, cover_url: coverUrl, spine_url: spineUrl });
        }
    };

    return (
        <div className="form-container">
            <h2 style={{ marginBottom: '2rem' }}>Novo Livro</h2>

            <div className="input-group">
                <label className="input-label">Título</label>
                <input
                    type="text"
                    className="input-text"
                    placeholder="Ex: O Senhor dos Anéis"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="input-group">
                <label className="input-label">Autor</label>
                <input
                    type="text"
                    className="input-text"
                    placeholder="Ex: J.R.R. Tolkien"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                />
            </div>

            <div className="input-group">
                <label className="input-label">URL da Capa (Opcional)</label>
                <input
                    type="text"
                    className="input-text"
                    placeholder="https://..."
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                />
                <small style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'block' }}>
                    Para exibir no popup de detalhes
                </small>
            </div>

            <div className="input-group">
                <label className="input-label">URL da Lombada (Opcional)</label>
                <input
                    type="text"
                    className="input-text"
                    placeholder="https://..."
                    value={spineUrl}
                    onChange={(e) => setSpineUrl(e.target.value)}
                />
                <small style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'block' }}>
                    Para exibir na estante
                </small>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button
                    className="btn-primary"
                    style={{ background: 'transparent', border: '1px solid #334155' }}
                    onClick={onCancel}
                >
                    Cancelar
                </button>
                <button
                    className="btn-primary"
                    disabled={!title.trim() || !author.trim()}
                    onClick={handleSubmit}
                >
                    Adicionar Livro
                </button>
            </div>
        </div>
    );
};
