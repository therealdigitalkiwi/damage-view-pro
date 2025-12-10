import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Settings, Database, Save, CheckCircle } from 'lucide-react';
import { SupabaseConfig, DEFAULT_CONFIG } from '@/types/supabase-config';
import { toast } from 'sonner';

interface ConfigurationTabProps {
  config: SupabaseConfig;
  onSave: (config: SupabaseConfig) => void;
}

export function ConfigurationTab({ config, onSave }: ConfigurationTabProps) {
  const [formData, setFormData] = useState<SupabaseConfig>(config);

  useEffect(() => {
    setFormData(config);
  }, [config]);

  const handleConnectionChange = (field: keyof Omit<SupabaseConfig, 'columns'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleColumnChange = (field: keyof SupabaseConfig['columns'], value: string) => {
    setFormData(prev => ({
      ...prev,
      columns: { ...prev.columns, [field]: value },
    }));
  };

  const handleSave = () => {
    if (!formData.url || !formData.anonKey || !formData.tableName) {
      toast.error('Please fill in all connection fields');
      return;
    }
    onSave(formData);
    toast.success('Configuration saved successfully');
  };

  const handleReset = () => {
    setFormData(DEFAULT_CONFIG);
    toast.info('Form reset to defaults');
  };

  const isConfigured = Boolean(formData.url && formData.anonKey && formData.tableName);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Supabase Connection
          </CardTitle>
          <CardDescription>
            Enter your Supabase project details to connect to your database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Supabase URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://your-project.supabase.co"
              value={formData.url}
              onChange={(e) => handleConnectionChange('url', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="anonKey">Anon Key</Label>
            <Input
              id="anonKey"
              type="password"
              placeholder="Your Supabase anon key"
              value={formData.anonKey}
              onChange={(e) => handleConnectionChange('anonKey', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tableName">Table Name</Label>
            <Input
              id="tableName"
              placeholder="damage_assessments"
              value={formData.tableName}
              onChange={(e) => handleConnectionChange('tableName', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Column Mappings
          </CardTitle>
          <CardDescription>
            Map your database column names to the required fields
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="col-jobId">Job ID Column</Label>
              <Input
                id="col-jobId"
                placeholder="job_id"
                value={formData.columns.jobId}
                onChange={(e) => handleColumnChange('jobId', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="col-propertyAddress">Property Address Column</Label>
              <Input
                id="col-propertyAddress"
                placeholder="property_address"
                value={formData.columns.propertyAddress}
                onChange={(e) => handleColumnChange('propertyAddress', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="col-location">Location Column</Label>
              <Input
                id="col-location"
                placeholder="location"
                value={formData.columns.location}
                onChange={(e) => handleColumnChange('location', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="col-locationsArray">Locations Array Column</Label>
              <Input
                id="col-locationsArray"
                placeholder="locations_array"
                value={formData.columns.locationsArray}
                onChange={(e) => handleColumnChange('locationsArray', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="col-numberOf">Number (X of Y) Column</Label>
              <Input
                id="col-numberOf"
                placeholder="number_of"
                value={formData.columns.numberOf}
                onChange={(e) => handleColumnChange('numberOf', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="col-fileName">File Name Column</Label>
              <Input
                id="col-fileName"
                placeholder="file_name"
                value={formData.columns.fileName}
                onChange={(e) => handleColumnChange('fileName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="col-description">Description Column</Label>
              <Input
                id="col-description"
                placeholder="description"
                value={formData.columns.description}
                onChange={(e) => handleColumnChange('description', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="col-caption">Caption Column</Label>
              <Input
                id="col-caption"
                placeholder="caption"
                value={formData.columns.caption}
                onChange={(e) => handleColumnChange('caption', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="col-damageDetected">Damage Detected Column</Label>
              <Input
                id="col-damageDetected"
                placeholder="damage_detected"
                value={formData.columns.damageDetected}
                onChange={(e) => handleColumnChange('damageDetected', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="col-damageLabel">Damage Label Column</Label>
              <Input
                id="col-damageLabel"
                placeholder="damage_label"
                value={formData.columns.damageLabel}
                onChange={(e) => handleColumnChange('damageLabel', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="col-imageLocation">Image Location/URL Column</Label>
              <Input
                id="col-imageLocation"
                placeholder="image_location"
                value={formData.columns.imageLocation}
                onChange={(e) => handleColumnChange('imageLocation', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {isConfigured ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Configuration complete</span>
            </>
          ) : (
            <span>Fill in all connection fields to enable</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}
