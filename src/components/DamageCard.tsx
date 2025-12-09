import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DamageImage } from '@/types/damage-assessment';
import { DamageScaleBadge } from './DamageScaleBadge';
import { LocationSelector } from './LocationSelector';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface DamageCardProps {
  image: DamageImage;
  onLocationChange: (imageId: string, newLocation: string) => void;
}

export const DamageCard = ({ image, onLocationChange }: DamageCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card className="overflow-hidden bg-card border-border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LocationSelector
              value={image.location}
              onChange={(newLocation) => onLocationChange(image.id, newLocation)}
            />
            <span className="text-sm text-muted-foreground">
              {image.locationIndex} of {image.totalLocations}
            </span>
          </div>
        </div>
      </CardHeader>

      <Dialog>
        <DialogTrigger asChild>
          <div className="relative cursor-pointer group">
            {!imageLoaded && (
              <div className="w-full aspect-[4/3] bg-muted animate-pulse" />
            )}
            <img
              src={image.imageUrl}
              alt={image.description}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              className={`w-full aspect-[4/3] object-cover transition-opacity group-hover:opacity-90 ${
                imageLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
              }`}
            />
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors flex items-center justify-center">
              <span className="text-background bg-foreground/80 px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                Click to expand
              </span>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl p-0 bg-background">
          <img
            src={image.imageUrl}
            alt={image.description}
            className="w-full h-auto"
          />
        </DialogContent>
      </Dialog>

      <CardContent className="pt-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-foreground">{image.imageName}</p>
          <DamageScaleBadge scale={image.damageScale} />
        </div>

        <div className="space-y-2">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Description</p>
            <p className="text-sm text-foreground">{image.description}</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Caption</p>
            <p className="text-sm text-foreground">{image.caption}</p>
          </div>

          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Damage Detected</p>
            <p className="text-sm font-medium text-foreground">{image.damageDetected}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
