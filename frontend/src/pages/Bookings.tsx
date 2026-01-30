import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingsApi } from '../api/bookings';
import type { Booking } from '../types';
import { getApiErrorMessage } from '../api/auth';
import { canApproveBookings } from '../types';

const PAGE_SIZE = 10;

export function Bookings() {
  const { user } = useAuth();
  const location = useLocation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Refetch when user, page, or route changes (e.g. after navigating back from CreateBooking)
  useEffect(() => {
    if (!user?.userId) return;
    setLoading(true);
    bookingsApi
      .getUserBookings(user.userId, { page, size: PAGE_SIZE })
      .then((res) => {
        setBookings(res.content);
        setTotalPages(res.totalPages);
        setTotalElements(res.totalElements);
      })
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [user?.userId, page, location.pathname]);

  const canApprove = user && canApproveBookings(user.role);

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await bookingsApi.cancel(bookingId);
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      setTotalElements((n) => Math.max(0, n - 1));
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="page-header page-header-flex">
        <div>
          <h1>My bookings</h1>
          <p>View and manage your bookings</p>
        </div>
        <Link to="/bookings/new" className="btn-primary">
          New booking
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p className="muted">Loading...</p>
      ) : bookings.length === 0 ? (
        <div className="card">
          <p className="muted">No bookings yet.</p>
          <Link to="/bookings/new" className="btn-primary" style={{ marginTop: '0.75rem', display: 'inline-block' }}>
            Create a booking
          </Link>
        </div>
      ) : (
        <>
          <div className="table-wrap card">
            <table>
              <thead>
                <tr>
                  <th>Resource</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Status</th>
                  <th>Purpose</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.resourceName}</td>
                    <td>{new Date(b.startTime).toLocaleString()}</td>
                    <td>{new Date(b.endTime).toLocaleString()}</td>
                    <td>
                      <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
                    </td>
                    <td>{b.purpose ?? '—'}</td>
                    <td>
                      {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                        <button
                          type="button"
                          className="btn-danger"
                          style={{ fontSize: '0.85rem', padding: '0.35rem 0.6rem' }}
                          onClick={() => handleCancel(b.id)}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button
                type="button"
                className="btn-secondary"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <span>
                Page {page + 1} of {totalPages} ({totalElements} total)
              </span>
              <button
                type="button"
                className="btn-secondary"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {canApprove && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <Link to="/bookings/pending" className="btn-primary">
            View pending bookings (approve)
          </Link>
        </div>
      )}
    </div>
  );
}
