function StatusBadge({ isOpenToWork }) {
  return (
    <span className={isOpenToWork ? 'status-badge status-open' : 'status-badge status-busy'}>
      <span className="status-dot"></span>
      {isOpenToWork ? 'Open to work' : 'Busy learning'}
    </span>
  )
}

export default StatusBadge
