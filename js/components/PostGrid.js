window.PostGrid = ({ data, loading, error }) => {
    if (loading) return <window.Loading />;
    if (error) return <window.Error message={error} />;

    return (
        <div className="grid">
            {data.map(post => (
                <window.Card
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    body={post.body}
                    friend={post.friend}
                    created_at={post.created_at}
                />
            ))}
        </div>
    );
};
