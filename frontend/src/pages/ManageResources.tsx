import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { resourcesApi } from '../api/resources';
import type { Resource, ResourceType } from '../types';
import { getApiErrorMessage } from '../api/auth';
import './Resources.css';

const PAGE_SIZE = 10;

export function ManageResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [typeFilter, setTypeFilter] = useState<ResourceType | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchResources = () => {
    setLoading(true);
    setError(null);
    const request = typeFilter
      ? resourcesApi.getByType(typeFilter as ResourceType, { page, size: PAGE_SIZE })
      : resourcesApi.getAll({ page, size: PAGE_SIZE });
    request
      .then((res) => {
        setResources(res.content);
        setTotalPages(res.totalPages);
        setTotalElements(res.totalElements);
      })
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchResources();
  }, [page, typeFilter]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete resource "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await resourcesApi.delete(id);
      fetchResources();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="page-header page-header-flex">
        <div>
          <h1>Manage Resources</h1>
          <p>Add, edit, or remove campus resources</p>
        </div>
        <Link to="/resources/manage/new" className="btn-primary">
          Add resource
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card filters">
        <label>
          Type:
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value as ResourceType | '');
              setPage(0);
            }}
          >
            <option value="">All</option>
            <option value="ROOM">Room</option>
            <option value="LAB">Lab</option>
            <option value="HALL">Hall</option>
            <option value="EQUIPMENT">Equipment</option>
            <option value="CAFETERIA">Cafeteria</option>
            <option value="LIBRARY">Library</option>
            <option value="PARKING">Parking</option>
            <option value="SPORTS">Sports</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p className="muted">Loading...</p>
      ) : resources.length === 0 ? (
        <div className="card">
          <p className="muted">No resources found.</p>
          <Link to="/resources/manage/new" className="btn-primary" style={{ marginTop: '0.5rem' }}>
            Add your first resource
          </Link>
        </div>
      ) : (
        <>
          <div className="table-wrap card">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <Link to={`/resources/${r.id}`}>{r.name}</Link>
                    </td>
                    <td>{r.type}</td>
                    <td>
                      <span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span>
                    </td>
                    <td>{r.location ?? '—'}</td>
                    <td>{r.capacity ?? '—'}</td>
                    <td>
                      <Link to={`/resources/${r.id}`} className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.35rem 0.6rem', marginRight: '0.35rem' }}>
                        View
                      </Link>
                      <Link to={`/resources/manage/${r.id}`} className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.35rem 0.6rem', marginRight: '0.35rem' }}>
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ fontSize: '0.85rem', padding: '0.35rem 0.6rem' }}
                        disabled={deletingId === r.id}
                        onClick={() => handleDelete(r.id, r.name)}
                      >
                        {deletingId === r.id ? 'Deleting...' : 'Delete'}
                      </button>
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
    </div>
  );
}
