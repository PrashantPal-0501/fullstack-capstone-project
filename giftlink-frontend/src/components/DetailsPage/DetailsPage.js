import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import config from '../../config';
import { useAuth } from '../../context/AuthContext';
import './DetailsPage.css';

function DetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authToken, isLoggedIn } = useAuth();

  const [gift, setGift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');
  const [posting, setPosting] = useState(false);

  const fetchGift = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/api/gifts/${id}`);
      if (!response.ok) {
        throw new Error('This gift listing could not be found');
      }
      const data = await response.json();
      setGift(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGift();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddComment = async e => {
    e.preventDefault();
    setCommentError('');

    if (!commentText.trim()) return;

    setPosting(true);
    try {
      const response = await fetch(`${config.apiUrl}/api/gifts/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ text: commentText.trim() })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Could not add comment');
      }

      setGift(data);
      setCommentText('');
    } catch (err) {
      setCommentError(err.message);
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="alert alert-danger m-4">{error}</div>;
  if (!gift) return null;

  return (
    <div className="container py-4">
      <button className="btn btn-link mb-3 ps-0" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      <div className="row g-4">
        <div className="col-md-6">
          <img
            src={gift.image || 'https://placehold.co/600x400?text=No+Image'}
            alt={gift.name}
            className="img-fluid rounded shadow-sm"
          />
        </div>
        <div className="col-md-6">
          <h2>{gift.name}</h2>
          <p className="text-muted">{gift.category}</p>
          <span className="badge bg-secondary mb-3">{gift.condition}</span>
          <p>{gift.description}</p>
        </div>
      </div>

      <hr className="my-4" />

      <h4>Comments</h4>
      {(gift.comments || []).length === 0 && <p className="text-muted">No comments yet.</p>}
      <ul className="list-group mb-4">
        {(gift.comments || []).map(comment => (
          <li className="list-group-item" key={comment._id}>
            <p className="mb-1">{comment.text}</p>
            <small className="text-muted">
              {comment.author_email} &middot;{' '}
              {new Date(comment.created_at).toLocaleDateString()}
            </small>
          </li>
        ))}
      </ul>

      {isLoggedIn ? (
        <form onSubmit={handleAddComment} className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Add a comment..."
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={posting}>
            {posting ? 'Posting...' : 'Post'}
          </button>
        </form>
      ) : (
        <p className="text-muted">Log in to leave a comment.</p>
      )}
      {commentError && <div className="alert alert-danger mt-2">{commentError}</div>}
    </div>
  );
}

export default DetailsPage;
