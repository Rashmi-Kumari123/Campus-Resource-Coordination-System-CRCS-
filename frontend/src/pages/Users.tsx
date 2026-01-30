import { useEffect, useState } from 'react';
import { usersApi } from '../api/users';
import type { UserProfile } from '../types';
import { getApiErrorMessage } from '../api/auth';

const PAGE_SIZE = 15;

export function Users() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    usersApi
      .getAll({ page, size: PAGE_SIZE })
      .then((res) => {
        setUsers(res.content);
        setTotalPages(res.totalPages);
        setTotalElements(res.totalElements);
      })
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div>
      <div className="page-header">
        <h1>Users</h1>
        <p>Manage user accounts (ADMIN only)</p>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <p className="muted">Loading...</p>
      ) : users.length === 0 ? (
        <div className="card">
          <p className="muted">No users found.</p>
        </div>
      ) : (
        <>
          <div className="table-wrap card">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.userId}>
                    <td>{u.name ?? '—'}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className="badge" style={{ background: 'var(--accent-muted)', color: 'var(--accent)' }}>
                        {u.role}
                      </span>
                    </td>
                    <td>{u.isActive !== false ? 'Yes' : 'No'}</td>
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
    </div>
  );
}
