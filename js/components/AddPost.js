const { useState } = React;

window.AddPost = ({ onCancel, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [friend, setFriend] = useState(window.FRIENDS[0]);

    const handleSubmit = () => {
        if (title.trim() && text.trim()) {
            onSubmit({ title, body: text, friend });
        }
    };

    return (
        <div className="form-container">
            <h2 style={{ marginBottom: '2rem' }}>Nova Pérola</h2>
            <div className="input-group">
                <window.CustomSelect
                    label="Quem falou?"
                    value={friend}
                    onChange={setFriend}
                    options={window.FRIENDS}
                />
            </div>
            <div className="input-group">
                <label className="input-label">Título</label>
                <input
                    type="text"
                    className="input-text"
                    placeholder="Ex: Fofoca do dia"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="input-group">
                <label className="input-label">O que aconteceu?</label>
                <textarea
                    className="input-textarea"
                    placeholder="Conte a fofoca..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
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
                    disabled={!title.trim() || !text.trim()}
                    onClick={handleSubmit}
                >
                    Enviar
                </button>
            </div>
        </div>
    );
};
