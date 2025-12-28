// src/app/(protected)/agent/settings/profile/page.tsx
'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function ProfileEditor() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      supabase
        .from('profiles')
        .select('*')
        .eq('clerk_user_id', user.id)  // ← Correct column name
        .single()
        .then(({ data, error }) => {
          if (error) {
            toast.error('Failed to load profile');
            console.error('Supabase error:', error);
          } else if (data) {
            setProfile(data);
          } else {
            toast.error('Profile not found');
          }
          setLoading(false);
        });
    }
  }, [isLoaded, user]);

  const handleSave = async () => {
    if (!profile || !user) return;

    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        bio: profile.bio,
        phone: profile.phone,
        custom_headline: profile.custom_headline || null,
        primary_color: profile.primary_color || '#00A3AD',
        show_consumer_section: profile.show_consumer_section,
        show_resources_section: profile.show_resources_section,
      })
      .eq('clerk_user_id', user.id);  // ← Correct column name

    setSaving(false);

    if (error) {
      toast.error('Failed to save profile');
      console.error('Save error:', error);
    } else {
      toast.success('Profile updated! Changes are live on your public site.');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl text-red-600">Unable to load profile. Please contact support.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Edit Your Public Profile</CardTitle>
          <CardDescription>
            Changes here instantly update your public agent site at {profile.subdomain}.fintechful.com
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={profile.full_name || ''}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="headline">Custom Headline (optional)</Label>
            <Input
              id="headline"
              placeholder="e.g., Your Local Financial Growth Expert"
              value={profile.custom_headline || ''}
              onChange={(e) => setProfile({ ...profile, custom_headline: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              rows={6}
              placeholder="Tell visitors about your experience..."
              value={profile.bio || ''}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="color">Primary Color (hex)</Label>
            <Input
              id="color"
              placeholder="#00A3AD"
              value={profile.primary_color || ''}
              onChange={(e) => setProfile({ ...profile, primary_color: e.target.value })}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Section Visibility</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="consumer">Show Consumer Section</Label>
              <Switch
                id="consumer"
                checked={profile.show_consumer_section ?? true}
                onCheckedChange={(checked) => setProfile({ ...profile, show_consumer_section: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="resources">Show Resources Section</Label>
              <Switch
                id="resources"
                checked={profile.show_resources_section ?? true}
                onCheckedChange={(checked) => setProfile({ ...profile, show_resources_section: checked })}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleSave} disabled={saving} className="bg-teal-600 hover:bg-teal-700">
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>

            <Button
              variant="outline"
              onClick={() => window.open(`https://${profile.subdomain}.fintechful.com`, '_blank')}
            >
              Preview Public Site →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}