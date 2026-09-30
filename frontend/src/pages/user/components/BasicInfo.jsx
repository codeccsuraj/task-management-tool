import React from 'react'

/* Requires Bootstrap 5 CSS to be loaded in your app, e.g. in main.jsx / index.js:
   import 'bootstrap/dist/css/bootstrap.min.css'
*/

/* ---------- design tokens ---------- */
const C = {
  border: '#e3e1da',
  rowLine: '#efede6',
  text: '#1c231f',
  muted: '#6b6f66',
  body: '#5b5f58',
  avatar: '#b9822b',
  green: '#2f6b4f',
  red: '#b93a32',
}

const cardStyle = { border: `1px solid ${C.border}`, borderRadius: 12 }

const STATUS_STYLES = {
  'In Progress': { background: '#e2ebf5', color: '#2f5f93' },
  'In Review': { background: '#fbecd6', color: '#a8691a' },
  Done: { background: '#e0efe6', color: '#2f6b4f' },
  Open: { background: '#ecece6', color: '#5b5f58' },
}

/* ---------- helpers ---------- */
const formatMonthYear = (date) => {
  if (!date) return '—'
  const d = new Date(date)
  if (isNaN(d)) return '—'
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

const getInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?'

const formatPhone = (phone) => {
  if (!phone) return '—'
  const digits = String(phone).replace(/\D/g, '')
  if (digits.length === 10) return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`
  return phone
}

/* ---------- small pieces ---------- */
const InfoRow = ({ label, value, last }) => (
  <div
    className="d-flex justify-content-between align-items-center gap-3 py-2 small"
    style={{ borderBottom: last ? 'none' : `1px solid ${C.rowLine}`, fontSize: 12 }}
  >
    <span style={{ color: C.muted }}>{label}</span>
    <span className="fw-bold text-end text-break" style={{ color: C.text }}>
      {value || '—'}
    </span>
  </div>
)

const Stat = ({ value, label, color }) => (
  <div className="col text-center">
    <div className="fw-bold lh-1" style={{ fontSize: 20, color }}>
      {value}
    </div>
    <div className="fw-semibold mt-1" style={{ fontSize: 11, color: '#4d524b' }}>
      {label}
    </div>
  </div>
)

const BasicInfo = ({ userData }) => {
  if (!userData) {
    return <p className="p-4 small text-secondary">No profile data available.</p>
  }

  const {
    full_name,
    role,
    bio,
    phone,
    address,
    authId,
    badge,
    stats = {},
    recentTickets = [],
  } = userData

  const { assigned = 0, resolved = 0, overdue = 0 } = stats

  return (
    <div className="row g-4 align-items-start">
      {/* Left: identity card */}
      <div className="col-12 col-lg-4 col-xl-3">
        <div className="bg-white p-4 text-center" style={cardStyle}>
          <div
            className="mx-auto d-flex align-items-center justify-content-center rounded-circle text-white fw-bold"
            style={{ width: 75, height: 75, fontSize: 26, background: C.avatar }}
          >
            {getInitials(full_name)}
          </div>

          <h2 className="h6 fw-bold mt-3 mb-0" style={{ color: C.text }}>
            {full_name || '—'}
          </h2>
          <p className="mb-0 mt-1" style={{ fontSize: 12, color: C.muted }}>
            {role || 'No role'}
          </p>

          {badge && (
            <span
              className="d-inline-block mt-2 px-2 py-1 rounded text-uppercase fw-bold"
              style={{ fontSize: 10, background: '#dfece5', color: '#1f5238' }}
            >
              {badge}
            </span>
          )}

          <div
            className="row g-0 mt-3 py-3"
            style={{
              borderTop: `1px solid ${C.border}`,
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <Stat value={assigned} label="Assigned" color={C.text} />
            <Stat value={resolved} label="Resolved" color={C.green} />
            <Stat value={overdue} label="Overdue" color={C.red} />
          </div>

          <p
            className="text-start mt-3 mb-0"
            style={{ fontSize: 12, lineHeight: 1.6, color: C.body }}
          >
            {bio || 'No bio added yet.'}
          </p>
        </div>
      </div>

      {/* Right column */}
      <div className="col-12 col-lg-8 col-xl-9">
        <div className="bg-white p-4 mb-4" style={cardStyle}>
          <h3 className="fw-bold mb-2" style={{ fontSize: 14, color: C.text }}>
            Personal information
          </h3>
          <InfoRow label="Full name" value={full_name} />
          <InfoRow label="Email" value={authId?.email} />
          <InfoRow label="Phone" value={formatPhone(phone)} />
          <InfoRow label="Role" value={role} />
          <InfoRow label="Location" value={address} />
          <InfoRow
            label="Member since" value={formatMonthYear(authId?.createdAt)}
            last
          />
        </div>

        <div className="bg-white p-4" style={cardStyle}>
          <h3 className="fw-bold mb-2" style={{ fontSize: 14, color: C.text }}>
            Recent tickets
          </h3>

          {recentTickets.length === 0 ? (
            <p className="mb-0 py-2" style={{ fontSize: 12, color: C.muted }}>
              No tickets assigned yet.
            </p>
          ) : (
            <ul className="list-unstyled mb-0">
              {recentTickets.map((t, i) => (
                <li
                  key={t.id}
                  className="d-flex align-items-center gap-3 py-2"
                  style={{
                    fontSize: 12,
                    borderBottom:
                      i === recentTickets.length - 1
                        ? 'none'
                        : `1px solid ${C.rowLine}`,
                  }}
                >
                  <span
                    className="fw-bold font-monospace flex-shrink-0"
                    style={{ width: 60, color: '#4d524b' }}
                  >
                    {t.id}
                  </span>
                  <span
                    className="flex-grow-1 text-truncate"
                    style={{ color: C.text, minWidth: 0 }}
                  >
                    {t.title}
                  </span>
                  <span
                    className="flex-shrink-0 rounded px-2 py-1 fw-bold"
                    style={{
                      fontSize: 10,
                      ...(STATUS_STYLES[t.status] || STATUS_STYLES.Open),
                    }}
                  >
                    {t.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default BasicInfo