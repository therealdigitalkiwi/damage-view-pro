import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LocationSelectorProps {
  value: string;
  locations: string[];
  onChange: (value: string) => void;
}

export const LocationSelector = ({ value, locations, onChange }: LocationSelectorProps) => {
  // Ensure current value is in the list
  const allLocations = locations.includes(value) ? locations : [value, ...locations];
  
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px] bg-background text-foreground">
        <SelectValue placeholder="Select location" />
      </SelectTrigger>
      <SelectContent className="bg-background border border-border z-50">
        {allLocations.map((location) => (
          <SelectItem key={location} value={location} className="text-foreground">
            {location}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
