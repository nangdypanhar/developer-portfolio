import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

function ProjectCard({ title, status, description, link }) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>{title}</CardTitle>
          <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 hover:bg-indigo-50">
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700">{description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700">
          <a href={link}>View project</a>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProjectCard
