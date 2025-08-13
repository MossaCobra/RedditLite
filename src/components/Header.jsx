import '../styles/header.css';

function Header({ search, setSearch, handleKeyPress }) {

    return (
        <header className="header">
            <nav className="navbar">
                <button
                aria-label="Toggle menu"
                className="hamburger-btn"
                //Onclick={sidePanel}
                >
                ☰
                </button>
            </nav>

            <div className="title-container">
                <h2>
                    Reddit<span>Lite</span>
                </h2>
            </div>

            <div className="search-container">
                <label htmlFor="search" className="visually-hidden">Search</label>
                <input
                    type="text"
                    id="search"
                    name="search"
                    placeholder="Search"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
            </div>
        </header>
    );
}

export default Header;
