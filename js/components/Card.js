window.Card = ({ title, body, id, friend, created_at }) => {
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

            <h2 className="card-title">
                {friend && <span style={{ color: '#8b5cf6', marginRight: '0.5rem' }}>{friend}:</span>}
                {title}
            </h2>
            <p className="card-body">{body}</p>
        </div>
    );
};
