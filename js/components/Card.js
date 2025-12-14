window.Card = ({ title, body, id, friend }) => (
    <div className="card">
        <div className="card-type">Post #{id}</div>
        <h2 className="card-title">
            {friend && <span style={{ color: '#8b5cf6', marginRight: '0.5rem' }}>{friend}:</span>}
            {title}
        </h2>
        <p className="card-body">{body}</p>
    </div>
);
