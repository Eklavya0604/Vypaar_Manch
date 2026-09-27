import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from './button';
import { toast } from 'sonner';

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string) => void;
  label: string;
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (e.g. 5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const { api } = await import('@/lib/api');
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data && response.data.secure_url) {
        onChange(response.data.secure_url);
        toast.success(`${label} uploaded successfully!`);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-slate-700 font-semibold">{label}</label>
      
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 group bg-slate-50">
          <img 
            src={value} 
            alt={label} 
            className="w-full h-48 object-cover transition-opacity group-hover:opacity-90"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button 
              type="button" 
              variant="destructive" 
              size="sm"
              onClick={() => onChange('')}
              className="gap-2"
            >
              <X className="h-4 w-4" /> Remove
            </Button>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 rounded-xl h-48 flex flex-col items-center justify-center gap-3 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
              <span className="text-sm text-slate-500 font-medium">Uploading...</span>
            </>
          ) : (
            <>
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-1">
                <Upload className="h-6 w-6" />
              </div>
              <div className="text-center">
                <span className="text-emerald-600 font-semibold hover:underline">Click to upload</span>
                <span className="text-slate-500"> or drag and drop</span>
                <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
              </div>
            </>
          )}
        </div>
      )}
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleUpload} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
}
