
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIdeas } from '@/hooks/useIdeas';
import { Lightbulb, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export const SavedIdeas = () => {
  const { ideas, loading } = useIdeas();

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="glass-card border-white/20 animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-white/10 rounded mb-2"></div>
              <div className="h-3 bg-white/5 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (ideas.length === 0) {
    return (
      <Card className="glass-card border-white/20 text-center p-8">
        <Lightbulb className="w-12 h-12 text-purple-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No saved ideas yet</h3>
        <p className="text-gray-400">Start by analyzing your first idea above!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold gradient-text mb-6">Your Saved Ideas</h3>
      {ideas.map((idea) => (
        <Card key={idea.id} className="glass-card border-white/20 hover:border-purple-400/50 transition-colors">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-white">{idea.title}</CardTitle>
                <CardDescription className="text-gray-300 mt-2">
                  {idea.description}
                </CardDescription>
              </div>
              {idea.rating && (
                <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                  {idea.rating}/10
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-gray-400">
              <Calendar className="w-4 h-4 mr-2" />
              {format(new Date(idea.created_at), 'MMM d, yyyy')}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
