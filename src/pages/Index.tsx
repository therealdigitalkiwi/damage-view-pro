import { useState } from 'react';
import { DamageCard } from '@/components/DamageCard';
import { JobLoader } from '@/components/JobLoader';
import { DamageImage, Job } from '@/types/damage-assessment';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseConfig } from '@/hooks/useSupabaseConfig';
import { fetchJobFromSupabase, updateImageLocation } from '@/hooks/useSupabaseQuery';

const Index = () => {
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [images, setImages] = useState<DamageImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { config, isConfigured } = useSupabaseConfig();

  const handleLoadJob = async (jobId: string) => {
    if (!isConfigured) {
      toast({
        title: 'Configuration Required',
        description: 'Please update src/config/supabase.ts with your Supabase credentials',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const fetchedImages = await fetchJobFromSupabase(jobId, config);
      
      if (fetchedImages.length === 0) {
        toast({
          title: 'No Data Found',
          description: `No images found for Job ID: ${jobId}`,
          variant: 'destructive',
        });
        setCurrentJob(null);
        setImages([]);
      } else {
        const job: Job = {
          id: jobId,
          name: `Job ${jobId}`,
          images: fetchedImages,
        };
        setCurrentJob(job);
        setImages(fetchedImages);
        toast({
          title: 'Job Loaded',
          description: `Loaded ${fetchedImages.length} images for Job ${jobId}`,
        });
      }
    } catch (error) {
      toast({
        title: 'Error Loading Job',
        description: error instanceof Error ? error.message : 'Failed to connect to Supabase',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationChange = async (imageId: string, newLocation: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === imageId ? { ...img, location: newLocation } : img
      )
    );

    try {
      await updateImageLocation(imageId, newLocation, config);
      toast({
        title: 'Location Updated',
        description: `Image location changed to ${newLocation}`,
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'Failed to save location',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold text-foreground">
            Damage Assessment Viewer
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            {currentJob && (
              <p className="text-sm text-muted-foreground">
                {currentJob.name} • {images.length} images
              </p>
            )}
            {!isConfigured && (
              <p className="text-sm text-amber-600">
                Update src/config/supabase.ts with your Supabase credentials
              </p>
            )}
          </div>
          <JobLoader onLoad={handleLoadJob} isLoading={isLoading} />
        </div>

        {!currentJob ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="text-2xl">📷</span>
            </div>
            <h2 className="text-xl font-medium text-foreground mb-2">
              No Job Loaded
            </h2>
            <p className="text-muted-foreground max-w-md">
              Enter a Job ID above to load damage assessment images.
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
