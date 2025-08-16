import { useNavigate } from 'react-router-dom';
import '../../styles/header.css';

function HeaderBack() {
    const navigate = useNavigate();

    return (
        <header className="header">
            <nav className="navbar">
                <button
                    aria-label="Back Home"
                    className="back-btn"
                    onClick={() => navigate("/")} 
                >
                ⬅️
                </button>
            </nav>

            <div className="title-container">
                <h2>
                    Reddit<span>Lite</span>
                </h2>
            </div>
        </header>
    );
}

export default HeaderBack;
