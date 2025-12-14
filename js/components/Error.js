window.Error = ({ message }) => (
    <div className="container">
        <div className="error-message">
            <h3>Oops! Something went wrong</h3>
            <p>{message}</p>
        </div>
    </div>
);
