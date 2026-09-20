import StatusBadge from './components/StatusBadge'
import './App.css'

function App() {
  return (
    <div className="profile">
      <h1>Nangdy Panhar</h1>
      <p>
        My goal for this course is to go from writing my first JSX by hand to
        shipping a full-stack app I'm proud to put in front of employers.
      </p>
      <StatusBadge isOpenToWork={true} />
    </div>
  )
}

export default App
