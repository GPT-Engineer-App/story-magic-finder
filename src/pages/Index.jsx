import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Terminal, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';

const fetchTopStories = async () => {
  const response = await fetch('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=100');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['topStories'],
    queryFn: fetchTopStories,
  });

  const filteredStories = data?.hits.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="bg-black text-green-400 min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center mb-6">
          <Terminal className="w-8 h-8 mr-2" />
          <h1 className="text-3xl font-bold">H4ck3r N3ws T0p 100</h1>
          <Zap className="w-8 h-8 ml-2" />
        </div>
      <div className="relative mb-4">
        <Input
          type="text"
          placeholder="Initiate search protocol..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-900 border-green-500 text-green-400 placeholder-green-600"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Terminal className="h-5 w-5 text-green-500" />
        </div>
      </div>
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, index) => (
            <Card key={index} className="animate-pulse bg-gray-900 border-green-500">
              <CardHeader>
                <div className="h-6 bg-green-900 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-green-900 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-green-900 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {error && <p className="text-red-500">Error: System Compromised - {error.message}</p>}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStories.map((story) => (
            <Card key={story.objectID} className="bg-gray-900 border-green-500 hover:border-green-400 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg text-green-400">{story.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-600 mb-2">Upvotes: {story.points}</p>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="bg-green-900 text-green-400 hover:bg-green-800 border-green-500"
                >
                  <a href={story.url} target="_blank" rel="noopener noreferrer">
                    Access Data <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  </div>
  );
};

export default Index;
