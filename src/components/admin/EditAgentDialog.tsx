// src/components/admin/EditAgentDialog.tsx
'use client';

import React from 'react';
import { useState } from 'react';
import { createClientOnly } from '@/utils/supabase/client-only';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Agent } from '@/types/agent';
import { createAgent } from '@/actions/createAgent';

type Props = {
  agent: Agent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export default function EditAgentDialog({ agent, open, onOpenChange, onSuccess }: Props) {
  const supabase = createClientOnly();
  const [loading, setLoading] = useState(false);
  const isNew = !agent;

  const [form, setForm] = useState({
    full_name: agent?.full_name || '',
    email: agent?.email || '',
    phone: agent?.phone || '',
    tagline: agent?.tagline || '',
    bio: agent?.bio || '',
    avatar_url: agent?.avatar_url || '',
  });

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      setForm({
        full_name: agent?.full_name || '',
        email: agent?.email || '',
        phone: agent?.phone || '',
        tagline: agent?.tagline || '',
        bio: agent?.bio || '',
        avatar_url: agent?.avatar_url || '',
      });
    }
  }, [agent, open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `${isNew ? form.email : agent!.clerk_user_id}/avatar.${fileExt}`;

    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (error) {
      toast.error('Upload failed', { description: error.message });
    } else {
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setForm(prev => ({ ...prev, avatar_url: publicUrl }));
      toast.success('Photo uploaded!');
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (isNew) {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value || '');
      });

      const result = await createAgent(formData);

      if (result.success) {
        toast.success('Agent created! Login link sent to their email.');
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error('Failed to create agent', { description: result.error });
      }
    } else {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: form.full_name,
          phone: form.phone,
          tagline: form.tagline,
          bio: form.bio,
          avatar_url: form.avatar_url,
        })
        .eq('clerk_user_id', agent!.clerk_user_id);

      if (error) {
        toast.error('Update failed', { description: error.message });
      } else {
        toast.success('Agent updated!');
        onSuccess();
        onOpenChange(false);
      }
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isNew ? 'Add New Agent' : 'Edit Agent'}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap- gap-6">
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={form.avatar_url} />
                <AvatarFallback>{form.full_name[0] || 'A'}</AvatarFallback>
              </Avatar>
              <Label htmlFor="avatar" className="cursor-pointer">
                <Button variant="outline" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                  {form.avatar_url ? 'Change Photo' : 'Upload Photo'}
                </Button>
                <input id="avatar" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </Label>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div>
              <Label>Full Name *</Label>
              <Input value={form.full_name} onChange={e => setForm(prev => ({ ...prev, full_name: e.target.value }))} />
            </div>

            <div>
              <Label>Email * {isNew ? '' : '(cannot change)'}</Label>
              <Input
                type="email"
                value={form.email}
                onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                disabled={!isNew}
                placeholder={isNew ? 'agent@company.com' : ''}
              />
            </div>

            <div>
              <Label>Phone</Label>
              <Input value={form.phone} onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))} />
            </div>

            <div>
              <Label>Tagline</Label>
              <Input value={form.tagline} onChange={e => setForm(prev => ({ ...prev, tagline: e.target.value }))} />
            </div>

            <div>
              <Label>Bio</Label>
              <Textarea rows={4} value={form.bio} onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading || !form.full_name || !form.email}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isNew ? 'Create Agent' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}