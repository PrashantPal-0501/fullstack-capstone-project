import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import config from '../../config';
import './SearchPage.css';

const CATEGORIES = ['All', 'Furniture', 'Electronics', 'Clothing', 'Books', 'Home Decor', 'Kitchen'];
const CONDITIONS = ['All', 'New', 'Like New', 'Older'];

function SearchPage() {
  const [category, setCategory] = useState('All');
  const [condition, setCondition] = useState('All');
  const [ageYears, setAgeYears] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const params = new URLSearchParams();
      if (category !== 'All') params.set('category', category);
      if (condition !== 'All') params.set('condition', condition);
      params.set('age_years', ageYears);
      if (searchTerm.trim()) params.set('name', searchTerm.trim());

      const response = await fetch(`${config.apiUrl}/api/search?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Search failed, please try again');
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4 search-page">
      <div className="filters-card card p-3 mx-auto mb-4">
        <h5>Filters</h5>

        <label className="form-label small fw-semibold mt-2">Category</label>
        <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label className="form-label small fw-semibold mt-3">Condition</label>
        <select className="form-select" value={condition} onChange={e => setCondition(e.target.value)}>
          {CONDITIONS.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label className="form-label small fw-semibold mt-3">Less than {ageYears} years</label>
        <input
          type="range"
          className="form-range"
          min="0"
          max="20"
          value={ageYears}
          onChange={e => setAgeYears(e.target.value)}
        />

        <input
          type="text"
          className="form-control mt-3"
          placeholder="Search for items..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />

        <button className="btn btn-primary w-100 mt-3" onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        {hasSearched && !loading && results.length === 0 && !error && (
          <p className="text-muted text-center">No items match your filters.</p>
        )}
        {results.map(item => (
          <div className="col-12 col-md-6 col-lg-4" key={item._id}>
            <Link to={`/app/product/${item._id}`} className="text-decoration-none text-dark">
              <div className="card h-100 shadow-sm">
                <img
                  src={item.image || 'https://placehold.co/400x250?text=No+Image'}
                  className="card-img-top"
                  alt={item.name}
                  style={{ height: '180px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h6 className="card-title mb-1">{item.name}</h6>
                  <p className="card-text small text-muted">{item.description}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchPage;
