import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingsApi } from '../api/bookings';
import { resourcesApi } from '../api/resources';
import type { Booking } from '../types';
import { getApiErrorMessage } from '../api/auth';

export function PendingBookings() {
  const [pending, setPending] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    resourcesApi
      .getAvailable({ page: 0, size: 20 })
      .then((res) => {
        const ids = res.content.map((r) => r.id);
        return Promise.all(ids.map((id) => bookingsApi.getResourceBookings(id, { page: 0, size: 50 })));
      })
      .then((pages) => {
        const all: Booking[] = [];
        pages.forEach((p) => all.push(...p.content.filter((b) => b.status === 'PENDING')));
        setPending(all);
      })
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await bookingsApi.approve(id);
      setPending((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Pending bookings</h1>
        <p>Approve or reject booking requests (FACILITY_MANAGER / ADMIN)</p>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <p className="muted">Loading...</p>
      ) : pending.length === 0 ? (
        <div className="card">
          <p className="muted">No pending bookings.</p>
        </div>
      ) : (
        <div className="table-wrap card">
          <table>
            <thead>
              <tr>
                <th>Resource</th>
                <th>Start</th>
                <th>End</th>
                <th>Purpose</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((b) => (
                <tr key={b.id}>
                  <td>{b.resourceName}</td>
                  <td>{new Date(b.startTime).toLocaleString()}</td>
                  <td>{new Date(b.endTime).toLocaleString()}</td>
                  <td>{b.purpose ?? '—'}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ fontSize: '0.85rem', padding: '0.35rem 0.6rem' }}
                      onClick={() => handleApprove(b.id)}
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p style={{ marginTop: '1rem' }}>
        <Link to="/bookings" className="btn-secondary">← Back to my bookings</Link>
      </p>
    </div>
  );
}
