// src/components/dashboard/ProfileForm.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';   // ← ONLY THIS

export default function ProfileForm({ initialProfile }: { initialProfile: any }) {
  const supabase = createClient();
  const [profile, setProfile] = useState(initialProfile);
  const [uploading, setUploading] = useState(false);

  const updateField = async (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
    await supabase
      .from('profiles')
      .update({ [field]: value })
      .eq('clerk_user_id', profile.clerk_user_id);
  };

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile.clerk_user_id) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `${profile.clerk_user_id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error('Upload failed', { description: uploadError.message });
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

    const { error: dbError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('clerk_user_id', profile.clerk_user_id);

    if (dbError) {
      toast.error('Failed to save photo', { description: dbError.message });
    } else {
      setProfile({ ...profile, avatar_url: publicUrl });
      toast.success('Profile picture updated!');
    }
    setUploading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold">Your Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Photo</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-40 w-40">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="text-4xl">
                {profile.full_name?.[0] || 'A'}
              </AvatarFallback>
            </Avatar>
            <Label htmlFor="photo" className="cursor-pointer">
              <Button variant="outline" disabled={uploading}>
                {uploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Change Photo
              </Button>
              <input
                id="photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={uploadAvatar}
              />
            </Label>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input
                  value={profile.full_name || ''}
                  onChange={(e) => updateField('full_name', e.target.value)}
                />
              </div>
              <div>
                <Label>Tagline</Label>
                <Input
                  placeholder="e.g. Helping SMBs crush it since 2023"
                  value={profile.tagline || ''}
                  onChange={(e) => updateField('tagline', e.target.value)}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={profile.phone || ''}
                  onChange={(e) => updateField('phone', e.target.value)}
                />
              </div>
              <div>
                <Label>Bio</Label>
                <Textarea
                  rows={6}
                  value={profile.bio || ''}
                  onChange={(e) => updateField('bio', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}