import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface JobLoaderProps {
  onLoad: (jobId: string) => void;
  isLoading: boolean;
}

export const JobLoader = ({ onLoad, isLoading }: JobLoaderProps) => {
  const [jobId, setJobId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jobId.trim()) {
      onLoad(jobId.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="Enter Job ID (e.g., JOB-001)"
        value={jobId}
        onChange={(e) => setJobId(e.target.value)}
        className="max-w-xs bg-background"
      />
      <Button type="submit" disabled={isLoading || !jobId.trim()}>
        <Search className="w-4 h-4 mr-2" />
        Load
      </Button>
    </form>
  );
};
