function StatusBadge({ isOpenToWork }) {
  return (
    <span
      className={
        isOpenToWork
          ? 'inline-flex w-fit shrink-0 self-start items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-100'
          : 'inline-flex w-fit shrink-0 self-start items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500 transition-colors hover:bg-gray-200'
      }
    >
      <span className={isOpenToWork ? 'h-2 w-2 rounded-full bg-indigo-600' : 'h-2 w-2 rounded-full bg-gray-500'} />
      {isOpenToWork ? 'Open to work' : 'Busy learning'}
    </span>
  )
}

export default StatusBadge
