function StatusBadge({ isOpenToWork }) {
  return (
    <span className={isOpenToWork ? 'status-badge status-open' : 'status-badge status-busy'}>
      {isOpenToWork ? 'Open to work' : 'Busy learning'}
    </span>
  )
}

export default StatusBadge
