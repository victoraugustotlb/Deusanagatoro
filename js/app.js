const { useState, useEffect } = React;

window.App = () => {
    const [currentView, setCurrentView] = useState('home');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data from our Serverless API
    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/posts');

            if (!response.ok) {
                // Determine if it's a server error or network error
                const errorText = await response.text();
                throw new Error(`Server Error: ${response.status} ${errorText}`);
            }

            const result = await response.json();
            setData(result);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch posts:", err);
            // Fallback for local development/broken connection
            setError("Could not load pearls. (If running locally, this is expected if API is not emulated)");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleNavigate = (view) => {
        setCurrentView(view);
    };

    const handleSubmitPost = async ({ title, body, friend }) => {
        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, body, friend }),
            });

            if (!response.ok) {
                throw new Error('Failed to save post');
            }

            const newPost = await response.json();

            // Update UI with new post (optimistic or robust)
            setData([newPost, ...data]);
            setCurrentView('home');
        } catch (err) {
            alert('Failed to save pearl: ' + err.message);
        }
    };

    const handleDeletePost = async (id) => {
        if (!confirm('Tem certeza que deseja excluir esta pérola?')) return;

        try {
            const response = await fetch(`/api/posts?id=${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete post');
            }

            setData(data.filter(post => post.id !== id));
        } catch (err) {
            alert('Failed to delete pearl: ' + err.message);
        }
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
                            <window.PostGrid
                                data={data}
                                loading={loading}
                                error={error}
                                onDelete={handleDeletePost}
                            />
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
