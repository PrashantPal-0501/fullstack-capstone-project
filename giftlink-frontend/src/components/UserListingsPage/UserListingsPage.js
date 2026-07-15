import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config';
import { useAuth } from '../../context/AuthContext';
import './UserListingsPage.css';

const CATEGORIES = ['Furniture', 'Electronics', 'Clothing', 'Books', 'Home Decor', 'Kitchen'];
const CONDITIONS = ['New', 'Like New', 'Older'];

function UserListingsPage() {
  const { user, authToken, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    category: CATEGORIES[0],
    condition: CONDITIONS[0],
    description: '',
    image: ''
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchMyListings = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/api/gift`);
      const data = await response.json();
      setListings(data.filter(g => g.owner_id === user?.id));
    } catch (err) {
      setError('Unable to load your listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/app/login');
      return;
    }
    fetchMyListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async e => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      const response = await fetch(`${config.apiUrl}/api/gift`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(form)
      });
      const data = await response.json();

      if (!response.ok) {
        const message = data.errors ? data.errors[0].msg : data.error || 'Could not create listing';
        throw new Error(message);
      }

      setListings([data, ...listings]);
      setForm({ name: '', category: CATEGORIES[0], condition: CONDITIONS[0], description: '', image: '' });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async giftId => {
    try {
      const response = await fetch(`${config.apiUrl}/api/gift/${giftId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (!response.ok && response.status !== 204) {
        throw new Error('Could not delete listing');
      }
      setListings(listings.filter(l => l._id !== giftId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center py-5">Loading your listings...</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4">My Listings</h2>

      <div className="card p-3 mb-4 listing-form-card">
        <h5>Share a new item</h5>
        {formError && <div className="alert alert-danger py-2">{formError}</div>}
        <form onSubmit={handleCreate}>
          <div className="row g-2">
            <div className="col-md-6">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Item name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                name="image"
                className="form-control"
                placeholder="Image URL (optional)"
                value={form.image}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <select name="category" className="form-select" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <select name="condition" className="form-select" value={form.condition} onChange={handleChange}>
                {CONDITIONS.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12">
              <textarea
                name="description"
                className="form-control"
                placeholder="Description"
                rows="2"
                value={form.description}
                onChange={handleChange}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-3" disabled={submitting}>
            {submitting ? 'Sharing...' : 'Share Item'}
          </button>
        </form>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {listings.length === 0 ? (
        <p className="text-muted">You haven't shared any items yet.</p>
      ) : (
        <div className="row g-4">
          {listings.map(item => (
            <div className="col-12 col-md-6 col-lg-4" key={item._id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={item.image || 'https://placehold.co/400x250?text=No+Image'}
                  className="card-img-top"
                  alt={item.name}
                  style={{ height: '180px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title">{item.name}</h6>
                  <p className="text-muted small">{item.condition}</p>
                  <button
                    className="btn btn-outline-danger mt-auto"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserListingsPage;
