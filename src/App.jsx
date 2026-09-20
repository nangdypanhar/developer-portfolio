import StatusBadge from './components/StatusBadge'
import './App.css'

function App() {
  return (
    <main className="page">
      <div className="card">
        <div className="avatar">NP</div>
        <h1>Nangdy Panhar</h1>
        <p className="role">Aspiring Full-Stack Developer</p>
        <p className="goal">
          My goal is to become one of the best software engineers in the world. I am passionate about learning new technologies and improving my skills.
        </p>
        <StatusBadge isOpenToWork={true} />
      </div>
    </main>
  )
}

export default App
