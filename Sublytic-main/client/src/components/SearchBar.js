import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search subscriptions..."
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          onSearch && onSearch(e.target.value);
        }}
      />
    </div>
  );
}

export default SearchBar;
