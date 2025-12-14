const { useState, useEffect } = React;

window.App = () => {
    const [currentView, setCurrentView] = useState('home');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=12');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                // Add a small artificial delay to show the loading spinner
                setTimeout(() => {
                    setData(result);
                    setLoading(false);
                }, 800);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleNavigate = (view) => {
        setCurrentView(view);
    };

    const handleSubmitPost = ({ title, body, friend }) => {
        const newPost = {
            id: Date.now(),
            title: title,
            body: body,
            friend: friend
        };
        setData([newPost, ...data]);
        setCurrentView('home');
    };

    return (
        <React.Fragment>
            <window.Navbar onNavigate={handleNavigate} />
            <div className="container">
                {currentView === 'home' ? (
                    <React.Fragment>
                        <header>
                            <h1>Dynamic API Feed</h1>
                            <p className="subtitle">Fetching live data using React & Modern CSS</p>
                        </header>
                        <main>
                            <window.PostGrid data={data} loading={loading} error={error} />
                        </main>
                    </React.Fragment>
                ) : (
                    <window.AddPost
                        onCancel={() => handleNavigate('home')}
                        onSubmit={handleSubmitPost}
                    />
                )}
            </div>
        </React.Fragment>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<window.App />);
