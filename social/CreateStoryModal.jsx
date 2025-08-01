import React, { useState } from 'react';
import { UploadFile } from '@/integrations/Core';
import { Story } from '@/entities/Story';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';
import { add } from 'date-fns';

export default function CreateStoryModal({ user, onStoryCreated }) {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [preview, setPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !user) return;

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      const expires_at = add(new Date(), { hours: 24 });
      
      await Story.create({
        file_url,
        caption,
        user_avatar: user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
        user_username: user.username || user.email.split('@')[0],
        expires_at: expires_at.toISOString()
      });

      onStoryCreated();
    } catch (error) {
      console.error("Failed to create story:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div>
        <label 
          htmlFor="story-file" 
          className="w-full h-48 border-2 border-dashed border-[#40444b] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 block"
        >
          {preview ? (
            <img src={preview} alt="Story preview" className="h-full w-full object-cover rounded-lg"/>
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-400 mb-2"/>
              <p className="text-gray-400">Click to upload image</p>
            </>
          )}
        </label>
        <Input 
          id="story-file" 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="hidden"
        />
      </div>
      
      <Textarea
        placeholder="Add a caption... (optional)"
        value={caption}
        onChange={e => setCaption(e.target.value)}
        className="bg-[#40444b] border-[#40444b] text-white placeholder-gray-400"
      />
      
      <Button 
        type="submit" 
        className="w-full bg-purple-600 hover:bg-purple-700" 
        disabled={!file || isUploading}
      >
        {isUploading ? 'Posting...' : 'Post Story'}
      </Button>
    </form>
  );
}
