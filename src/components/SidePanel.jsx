import '../styles/sidepanel.css';
import { setFilter } from '../features/filters/filterSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectFilter } from '../features/filters/filterSlice';

function SidePanel({ onClose, setIsSearching }) {
	const dispatch = useDispatch();
	const current = useSelector(selectFilter);

	function handleFilterChange(e) {
		const value = e.target.value;
        setIsSearching(false);
		dispatch(setFilter(value));
	}

	return (
		<aside className="sidepanel">
			<button className="close-btn" onClick={onClose}>×</button>
			<h2>Subreddit</h2>
			<div className="filter-section">
				<label>
					<input type="radio" name="subreddit" value="all" onChange={handleFilterChange} checked={current === 'all'} />
					All Subreddits
				</label>
				<label>
					<input type="radio" name="subreddit" value="announcements" onChange={handleFilterChange} checked={current === 'announcements'} />
					r/announcements
				</label>
				<label>
					<input type="radio" name="subreddit" value="funny" onChange={handleFilterChange} checked={current === 'funny'} />
					r/funny
				</label>
				<label>
					<input type="radio" name="subreddit" value="AskReddit" onChange={handleFilterChange} checked={current === 'AskReddit'} />
					r/AskReddit
				</label>
				<label>
					<input type="radio" name="subreddit" value="gaming" onChange={handleFilterChange} checked={current === 'gaming'} />
					r/gaming
				</label>
				<label>
					<input type="radio" name="subreddit" value="worldnews" onChange={handleFilterChange} checked={current === 'worldnews'} />
					r/worldnews
				</label>
				<label>
					<input type="radio" name="subreddit" value="todayilearned" onChange={handleFilterChange} checked={current === 'todayilearned'} />
					r/todayilearned
				</label>
				<label>
					<input type="radio" name="subreddit" value="aww" onChange={handleFilterChange} checked={current === 'aww'} />
					r/aww
				</label>
				<label>
					<input type="radio" name="subreddit" value="Music" onChange={handleFilterChange} checked={current === 'Music'} />
					r/Music
				</label>
				<label>
					<input type="radio" name="subreddit" value="movies" onChange={handleFilterChange} checked={current === 'movies'} />
					r/movies
				</label>
				<label>
					<input type="radio" name="subreddit" value="memes" onChange={handleFilterChange} checked={current === 'memes'} />
					r/memes
				</label>
			</div>
		</aside>
	)
}

export default SidePanel;