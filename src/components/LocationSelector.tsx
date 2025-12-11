import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface LocationSelectorProps {
  value: string;
  locations: string[];
  onChange: (value: string) => void;
}

const OTHER_VALUE = '__other__';

export const LocationSelector = ({ value, locations, onChange }: LocationSelectorProps) => {
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState('');

  // Ensure current value is in the list
  const allLocations = locations.includes(value) ? locations : [value, ...locations];

  const handleSelectChange = (selectedValue: string) => {
    if (selectedValue === OTHER_VALUE) {
      setIsCustomMode(true);
      setCustomValue('');
    } else {
      onChange(selectedValue);
    }
  };

  const handleSaveCustom = () => {
    if (customValue.trim()) {
      onChange(customValue.trim());
      setIsCustomMode(false);
      setCustomValue('');
    }
  };

  const handleCancelCustom = () => {
    setIsCustomMode(false);
    setCustomValue('');
  };

  if (isCustomMode) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          placeholder="Enter custom location"
          className="w-[180px] h-9"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSaveCustom();
            if (e.key === 'Escape') handleCancelCustom();
          }}
        />
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSaveCustom}>
          <Check className="h-4 w-4 text-green-600" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancelCustom}>
          <X className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={handleSelectChange}>
      <SelectTrigger className="w-[180px] bg-background text-foreground">
        <SelectValue placeholder="Select location" />
      </SelectTrigger>
      <SelectContent className="bg-background border border-border z-50">
        {allLocations.map((location) => (
          <SelectItem key={location} value={location} className="text-foreground">
            {location}
          </SelectItem>
        ))}
        <SelectItem value={OTHER_VALUE} className="text-foreground italic border-t border-border mt-1 pt-1">
          Other...
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
