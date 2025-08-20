import '../styles/sidepanel.css';

function SidePanel({ onClose }) {
    return (
        <aside className="sidepanel">
            <button className="close-btn" onClick={onClose}>×</button>
            <h2>Subreddit</h2>
            <div className="filter-section">
                <label>
                    <input type="radio" name="subreddit" value="all" defaultChecked />
                    All Subreddits
                </label>
                
                <label>
                    <input type="radio" name="subreddit" value="announcements" />
                    r/announcements
                </label>
                
                <label>
                    <input type="radio" name="subreddit" value="funny" />
                    r/funny
                </label>
                
                <label>
                    <input type="radio" name="subreddit" value="AskReddit" />
                    r/AskReddit
                </label>
                
                <label>
                    <input type="radio" name="subreddit" value="gaming" />
                    r/gaming
                </label>
                
                <label>
                    <input type="radio" name="subreddit" value="worldnews" />
                    r/worldnews
                </label>
                
                <label>
                    <input type="radio" name="subreddit" value="todayilearned" />
                    r/todayilearned
                </label>
                
                <label>
                    <input type="radio" name="subreddit" value="aww" />
                    r/aww
                </label>
                
                <label>
                    <input type="radio" name="subreddit" value="Music" />
                    r/Music
                </label>
                
                <label>
                    <input type="radio" name="subreddit" value="movies" />
                    r/movies
                </label>
                
                <label>
                    <input type="radio" name="subreddit" value="memes" />
                    r/memes
                </label>
            </div>
        </aside>
    )
}

export default SidePanel;