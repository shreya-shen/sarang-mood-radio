
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useApp } from '@/contexts/AppContext'
import { Database, Cloud, Globe } from 'lucide-react'

export const DataSourceSelector = () => {
  const { dataSource, setDataSource } = useApp()

  const dataSources = [
    {
      id: 'mock' as const,
      name: 'Mock Data',
      description: 'Use sample data for testing and development',
      icon: Database,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'supabase' as const,
      name: 'Supabase',
      description: 'Full-stack with Supabase backend',
      icon: Cloud,
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'external' as const,
      name: 'External API',
      description: 'Connect to your custom backend',
      icon: Globe,
      color: 'bg-purple-100 text-purple-800'
    }
  ]

  return (
    <Card className="mood-card">
      <CardHeader>
        <CardTitle>Data Source Configuration</CardTitle>
        <CardDescription>
          Choose how Sarang should handle data and authentication
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {dataSources.map((source) => {
            const Icon = source.icon
            const isActive = dataSource === source.id
            
            return (
              <div key={source.id} className="relative">
                <Button
                  variant={isActive ? "default" : "outline"}
                  className="w-full h-auto p-4 flex flex-col space-y-2"
                  onClick={() => setDataSource(source.id)}
                >
                  <Icon className="h-8 w-8" />
                  <span className="font-semibold">{source.name}</span>
                  <span className="text-xs text-center opacity-75">
                    {source.description}
                  </span>
                </Button>
                {isActive && (
                  <Badge className={`absolute -top-2 -right-2 ${source.color}`}>
                    Active
                  </Badge>
                )}
              </div>
            )
          })}
        </div>
        
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Current Configuration:</h4>
          <p className="text-sm text-gray-600">
            <strong>Data Source:</strong> {dataSources.find(s => s.id === dataSource)?.name}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {dataSource === 'mock' && 'Using sample data for demonstration'}
            {dataSource === 'supabase' && 'Connected to Supabase for full backend functionality'}
            {dataSource === 'external' && 'Configured to use external API endpoints'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
