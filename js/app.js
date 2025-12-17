const { useState, useEffect } = React;

window.App = () => {
  const [currentView, setCurrentView] = useState("home");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");
  const [filter, setFilter] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState(""); // filtro de busca por texto
  const [sortOrder, setSortOrder] = useState("Mais recentes"); // filtro de data

  // Apply theme on mount and change
  useEffect(() => {
    const applyTheme = () => {
      let targetTheme = theme;

      // Se for 'system', descobre qual é a preferência do SO do usuário
      if (theme === "system") {
        const systemDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        targetTheme = systemDark ? "dark" : "light";
      }

      document.documentElement.setAttribute("data-theme", targetTheme);
      localStorage.setItem("theme", theme);
    };

    applyTheme();

    // Se estiver em modo 'system', adiciona um ouvinte para mudar automaticamente
    // caso o usuário mude o tema do próprio computador/celular enquanto usa o site
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme();

      // Suporte para navegadores mais novos e antigos
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleChange);
      } else {
        mediaQuery.addListener(handleChange);
      }

      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener("change", handleChange);
        } else {
          mediaQuery.removeListener(handleChange);
        }
      };
    }
  }, [theme]);

  // Agora aceita o argumento que vem do Navbar ('light', 'dark' ou 'system')
  const handleToggleTheme = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  // Fetch data from our Serverless API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/posts");

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
      setError(
        "Could not load pearls. (If running locally, this is expected if API is not emulated)"
      );
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
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, body, friend }),
      });

      if (!response.ok) {
        throw new Error("Failed to save post");
      }

      const newPost = await response.json();

      // Update UI with new post (optimistic or robust)
      setData([newPost, ...data]);
      setCurrentView("home");
    } catch (err) {
      alert("Failed to save pearl: " + err.message);
    }
  };

  const handleDeletePost = async (id) => {
    if (!confirm("Tem certeza que deseja excluir esta pérola?")) return;

    try {
      const response = await fetch(`/api/posts?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      setData(data.filter((post) => post.id !== id));
    } catch (err) {
      alert("Failed to delete pearl: " + err.message);
    }
  };

  const handleSubmitBook = async ({ title, author, cover_url, spine_url }) => {
    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, cover_url, spine_url }),
      });

      if (!response.ok) throw new Error("Failed to save book");

      // Force reload of books page data?
      // For now, simpler to just navigate back. BooksPage will refetch on mount.
      setCurrentView("books");
    } catch (err) {
      alert("Failed to save book: " + err.message);
    }
  };

  // LÓGICA DE FILTRAGEM E ORDENAÇÃO
  const getProcessedData = () => {
    let processed = [...data];

    // Filtro por Nome (Amigo)
    if (filter !== "Todos") {
      processed = processed.filter((post) => post.friend === filter);
    }

    // Filtro por Texto (Título ou Conteúdo)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      processed = processed.filter(
        (post) =>
          (post.title && post.title.toLowerCase().includes(term)) ||
          (post.body && post.body.toLowerCase().includes(term))
      );
    }

    // Ordenação por Data
    processed.sort((a, b) => {
      const dateA = new Date(a.date || a.created_at || 0);
      const dateB = new Date(b.date || b.created_at || 0);

      if (sortOrder === "Mais recentes") {
        return dateB - dateA; // Decrescente
      } else {
        return dateA - dateB; // Crescente
      }
    });
    return processed;
  };

  const filteredData = getProcessedData();

  return (
    <React.Fragment>
      <window.Navbar
        onNavigate={handleNavigate}
        onToggleTheme={handleToggleTheme}
        theme={theme}
        currentView={currentView}
      />
      <div className="container">
        {(currentView === "home" || currentView === "add") && (
          <React.Fragment>
            <header>
              <h1>As pérolas de 2026 já estão aqui</h1>
              <p className="subtitle">
                Disclaimer: utilize de forma moderada, database limitada!
              </p>
            </header>
            {/* ÁREA DE FILTROS */}
            <div className="filters-toolbar">
              {/* Busca por Texto com Ícone */}
              <div className="filter-group">
                <label className="filter-label">Pesquisar</label>
                <div className="input-icon-wrapper">
                  {/* Ícone de Lupa SVG */}
                  <svg
                    className="input-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>

                  <input
                    type="text"
                    className="styled-input"
                    placeholder="Título ou conteúdo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Filtro por Nome */}
              <div className="filter-group">
                <div className="filter-header">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-person"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                  </svg>
                  <label className="filter-label">Filtrar por Autor</label>
                </div>

                <window.CustomSelect
                  value={filter}
                  onChange={setFilter}
                  options={["Todos", ...window.FRIENDS]}
                />
              </div>

              {/* Filtro de data */}
              <div className="filter-group">
                <div className="filter-header">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-calendar"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                  </svg>
                  <label className="filter-label">Filtro de data</label>
                </div>

                <window.CustomSelect
                  value={sortOrder}
                  onChange={setSortOrder}
                  options={["Mais recentes", "Mais antigos"]}
                />
              </div>
            </div>

            <main>
              {/* Passamos a variável processada aqui ao invés de filtrar inline */}
              <window.PostGrid
                data={filteredData}
                loading={loading}
                error={error}
                onDelete={handleDeletePost}
              />
            </main>
          </React.Fragment>
        )}

        {currentView === "add" && (
          <window.AddPost
            onCancel={() => handleNavigate("home")}
            onSubmit={handleSubmitPost}
          />
        )}

        {currentView === "books" && <window.BooksPage />}

        {currentView === "add-book" && (
          <window.AddBook
            onCancel={() => handleNavigate("books")}
            onSubmit={handleSubmitBook}
          />
        )}
      </div>
      <window.Footer />
    </React.Fragment>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<window.App />);
