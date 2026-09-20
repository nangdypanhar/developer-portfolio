import ProjectCard from '../components/ProjectCard'
import Section from '../components/Section'
import StatusBadge from '../components/StatusBadge'

const projects = [
  {
    title: 'Developer Portfolio',
    status: 'In progress',
    description: 'A Vite + React portfolio styled with Tailwind CSS and shadcn/ui components.',
    link: '#',
  },
  {
    title: 'Task Tracker API',
    status: 'Completed',
    description: 'A REST API for managing personal tasks, built with Node.js and Express.',
    link: '#',
  },
]

const skills = ['JavaScript', 'React', 'Tailwind CSS', 'Node.js', 'Git']

function Home() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      <main className="flex flex-col gap-8 md:col-span-2">
        <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <img
            src="https://github.com/nangdypanhar.png"
            alt="Nangdy Panhar"
            className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-indigo-100"
          />
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-gray-900">Nangdy Panhar</h1>
            <p className="text-sm font-medium text-indigo-600">Aspiring Full-Stack Developer</p>
          </div>
        </header>

        <Section title="About">
          <p className="text-base leading-relaxed text-gray-700">
            My goal is to become one of the best software engineers in the world. I am
            passionate about learning new technologies and improving my skills.
          </p>
          <StatusBadge isOpenToWork={true} />
        </Section>

        <Section title="Projects">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </Section>
      </main>

      <aside className="flex flex-col gap-8">
        <Section title="Skills">
          <ul className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <li
                key={skill}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
              >
                {skill}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Focus">
          <p className="text-sm text-gray-500">
            Currently deepening my React and Tailwind skills through hands-on projects.
          </p>
        </Section>
      </aside>
    </div>
  )
}

export default Home
