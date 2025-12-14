const { useState, useEffect } = React;

window.App = () => {
    const [currentView, setCurrentView] = useState('home');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Load local pearls first
                const localPearls = JSON.parse(localStorage.getItem('my_pearls') || '[]');

                const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=12');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const apiResult = await response.json();

                // 2. Combine: Local pearls first, then API pearls
                setTimeout(() => {
                    setData([...localPearls, ...apiResult]);
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

        // 1. Update UI state
        setData([newPost, ...data]);
        setCurrentView('home');

        // 2. Save to LocalStorage
        const existingPearls = JSON.parse(localStorage.getItem('my_pearls') || '[]');
        const updatedPearls = [newPost, ...existingPearls];
        localStorage.setItem('my_pearls', JSON.stringify(updatedPearls));
    };

    return (
        <React.Fragment>
            <window.Navbar onNavigate={handleNavigate} />
            <div className="container">
                {currentView === 'home' ? (
                    <React.Fragment>
                        <header>
                            <h1>As pérolas de 2026 já estão aqui</h1>
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
