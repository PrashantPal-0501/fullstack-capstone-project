import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import config from '../../config';
import './MainPage.css';

const conditionColor = {
  New: 'text-success',
  'Like New': 'text-primary',
  Older: 'text-warning'
};

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function MainPage() {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/api/gift`);
        if (!response.ok) {
          throw new Error('Unable to load gifts right now');
        }
        const data = await response.json();
        setGifts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGifts();
  }, []);

  if (loading) {
    return <div className="text-center py-5">Loading gifts...</div>;
  }

  if (error) {
    return <div className="alert alert-danger m-4">{error}</div>;
  }

  return (
    <div className="container py-4">
      <div className="row g-4">
        {gifts.length === 0 && (
          <p className="text-muted">No gifts have been listed yet. Be the first to share one!</p>
        )}
        {gifts.map(gift => (
          <div className="col-12 col-sm-6 col-md-4" key={gift._id}>
            <div className="card h-100 shadow-sm">
              <img
                src={gift.image || 'https://placehold.co/400x250?text=No+Image'}
                className="card-img-top"
                alt={gift.name}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{gift.name}</h5>
                <p className={`fw-semibold mb-1 ${conditionColor[gift.condition] || ''}`}>
                  {gift.condition}
                </p>
                <p className="text-muted small mb-3">{formatDate(gift.date_added)}</p>
                <Link to={`/app/product/${gift._id}`} className="btn btn-primary mt-auto">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainPage;
