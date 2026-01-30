import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resourcesApi } from '../api/resources';
import { useAuth } from '../context/AuthContext';
import { canManageResources } from '../types';
import type { Resource } from '../types';
import { getApiErrorMessage } from '../api/auth';
import './ResourceForm.css';

export function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [resource, setResource] = useState<Resource | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    resourcesApi
      .getById(id)
      .then(setResource)
      .catch((err) => setError(getApiErrorMessage(err)));
  }, [id]);

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!resource) return <p className="muted">Loading...</p>;

  const canManage = user && canManageResources(user.role);

  return (
    <div>
      <div className="page-header page-header-flex">
        <div>
          <h1>{resource.name}</h1>
          <p>
            <span className={`badge badge-${resource.status.toLowerCase()}`}>{resource.status}</span>{' '}
            {resource.type}
          </p>
        </div>
        {canManage && (
          <Link to={`/resources/manage/${resource.id}`} className="btn-primary">
            Edit resource
          </Link>
        )}
      </div>
      <div className="card">
        <dl className="detail-list">
          <dt>Type</dt>
          <dd>{resource.type}</dd>
          <dt>Status</dt>
          <dd>
            <span className={`badge badge-${resource.status.toLowerCase()}`}>{resource.status}</span>
          </dd>
          {resource.location && (
            <>
              <dt>Location</dt>
              <dd>{resource.location}</dd>
            </>
          )}
          {resource.capacity != null && (
            <>
              <dt>Capacity</dt>
              <dd>{resource.capacity}</dd>
            </>
          )}
          {resource.description && (
            <>
              <dt>Description</dt>
              <dd>{resource.description}</dd>
            </>
          )}
          {resource.responsiblePerson && (
            <>
              <dt>Responsible person</dt>
              <dd>{resource.responsiblePerson}</dd>
            </>
          )}
        </dl>
        <Link to="/bookings/new" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
          Book this resource
        </Link>
      </div>
    </div>
  );
}
