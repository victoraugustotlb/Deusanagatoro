window.Card = ({ title, body, id, friend, created_at, onDelete }) => {
    // Format date: "14/12/2025 às 16:59"
    let dateString = "";
    if (created_at) {
        const date = new Date(created_at);
        if (!isNaN(date.getTime())) {
            dateString = date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).replace(',', ' às');
        }
    }

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div className="card-type">Post #{id}</div>
                {dateString && (
                    <div className="card-date" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', opacity: 0.8 }}>
                        {dateString}
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h2 className="card-title" style={{ flexGrow: 1 }}>
                    {friend && <span style={{ color: '#8b5cf6', marginRight: '0.5rem' }}>{friend}:</span>}
                    {title}
                </h2>
                <button
                    onClick={() => onDelete && onDelete(id)}
                    className="delete-btn"
                    title="Excluir"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '0.25rem', opacity: 0.7, transition: 'opacity 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                    onMouseOut={(e) => e.currentTarget.style.opacity = 0.7}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
            <p className="card-body">{body}</p>
        </div>
    );
};
