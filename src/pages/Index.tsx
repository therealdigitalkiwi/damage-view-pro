import { useState } from 'react';
import { DamageCard } from '@/components/DamageCard';
import { JobLoader } from '@/components/JobLoader';
import { DamageImage, Job } from '@/types/damage-assessment';
import { mockJobs } from '@/data/mock-data';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [images, setImages] = useState<DamageImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLoadJob = (jobId: string) => {
    setIsLoading(true);
    
    // Simulate API call - replace with Supabase query later
    setTimeout(() => {
      const job = mockJobs[jobId];
      if (job) {
        setCurrentJob(job);
        setImages(job.images);
        toast({
          title: 'Job Loaded',
          description: `Loaded ${job.images.length} images from ${job.name}`,
        });
      } else {
        toast({
          title: 'Job Not Found',
          description: `No job found with ID: ${jobId}`,
          variant: 'destructive',
        });
      }
      setIsLoading(false);
    }, 500);
  };

  const handleLocationChange = (imageId: string, newLocation: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === imageId ? { ...img, location: newLocation } : img
      )
    );
    toast({
      title: 'Location Updated',
      description: `Image location changed to ${newLocation}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Damage Assessment Viewer
              </h1>
              {currentJob && (
                <p className="text-sm text-muted-foreground mt-1">
                  {currentJob.name} • {images.length} images
                </p>
              )}
            </div>
            <JobLoader onLoad={handleLoadJob} isLoading={isLoading} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {!currentJob ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="text-2xl">📷</span>
            </div>
            <h2 className="text-xl font-medium text-foreground mb-2">
              No Job Loaded
            </h2>
            <p className="text-muted-foreground max-w-md">
              Enter a Job ID above to load damage assessment images. Try "JOB-001" or "JOB-002" for demo data.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {images.map((image) => (
              <DamageCard
                key={image.id}
                image={image}
                onLocationChange={handleLocationChange}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
