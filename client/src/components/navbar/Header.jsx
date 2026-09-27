import React from 'react'

const Header = () => {
    return (
        <nav className="d-flex align-items-center justify-content-between bg-white border-bottom px-4 py-2">
            {/* Breadcrumbs */}
            <div className="small">
                <span className="fw-bold text-dark">Task</span>
                <span className="text-muted">page</span>
            </div>

            {/* Right side */}
            <div className="d-flex align-items-center gap-3">
                <div className="input-group input-group-sm" style={{ width: '220px' }}>
                    <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-search text-muted" />
                    </span>
                    <input
                        type="text"
                        className="form-control bg-light border-start-0"
                        placeholder="Search tickets…"
                    />
                </div>

                <button
                    type="button"
                    className="btn btn-success btn-sm fw-semibold"
                >
                    + New ticket
                </button>

                <div
                    className="d-flex align-items-center justify-content-center rounded-circle bg-warning text-white fw-bold"
                    style={{ width: '32px', height: '32px', fontSize: '12px' }}
                >
                    user
                </div>
            </div>
        </nav>
    )
}

export default Header
