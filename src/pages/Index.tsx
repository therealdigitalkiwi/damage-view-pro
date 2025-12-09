import { useState } from 'react';
import { DamageCard } from '@/components/DamageCard';
import { JobLoader } from '@/components/JobLoader';
import { ConfigurationTab } from '@/components/ConfigurationTab';
import { DamageImage, Job } from '@/types/damage-assessment';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseConfig } from '@/hooks/useSupabaseConfig';
import { fetchJobFromSupabase } from '@/hooks/useSupabaseQuery';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageIcon, Settings } from 'lucide-react';

const Index = () => {
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [images, setImages] = useState<DamageImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { config, saveConfig, isConfigured } = useSupabaseConfig();

  const handleLoadJob = async (jobId: string) => {
    if (!isConfigured) {
      toast({
        title: 'Configuration Required',
        description: 'Please configure Supabase connection in the Configuration tab',
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
          <h1 className="text-2xl font-semibold text-foreground">
            Damage Assessment Viewer
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="viewer" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="viewer" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Viewer
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="viewer">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                {currentJob && (
                  <p className="text-sm text-muted-foreground">
                    {currentJob.name} • {images.length} images
                  </p>
                )}
                {!isConfigured && (
                  <p className="text-sm text-amber-600">
                    Configure Supabase connection in the Configuration tab
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
          </TabsContent>

          <TabsContent value="config">
            <ConfigurationTab config={config} onSave={saveConfig} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
