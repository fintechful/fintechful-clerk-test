// src/components/admin/EditAgentDialog.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Agent } from '@/types/agent';

type Props = {
  agent: Agent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export default function EditAgentDialog({ agent, open, onOpenChange, onSuccess }: Props) {
  const supabase = createClient();
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

  // Only used when creating a new agent
  const [newPassword] = useState(Math.random().toString(36).slice(-10) + 'A1!');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const clerkUserId = agent?.clerk_user_id || form.email; // fallback for new agents
    if (!clerkUserId) return;

    setLoading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `${clerkUserId}/avatar.${fileExt}`;

    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (error) {
      toast.error('Upload failed', { description: error.message });
    } else {
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setForm({ ...form, avatar_url: publicUrl });
      toast.success('Photo uploaded!');
    }
    setLoading(false);
  };

  const saveAgent = async () => {
    setLoading(true);

    try {
      if (isNew) {
        // CREATE NEW AGENT via Clerk + Supabase profile
        const { data: authUser, error: clerkError } = await supabase.auth.admin.createUser({
          email: form.email,
          password: newPassword,
          email_confirm: true,
          user_metadata: { full_name: form.full_name },
        });

        if (clerkError) throw clerkError;

        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            clerk_user_id: authUser.user.id,
            full_name: form.full_name,
            email: form.email,
            phone: form.phone || null,
            tagline: form.tagline || null,
            bio: form.bio || null,
            avatar_url: form.avatar_url || null,
            role: 'agent',
          });

        if (profileError) throw profileError;

        toast.success('Agent created! Password sent to their email.');
      } else {
        // UPDATE EXISTING AGENT
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: form.full_name,
            phone: form.phone || null,
            tagline: form.tagline || null,
            bio: form.bio || null,
            avatar_url: form.avatar_url || null,
          })
          .eq('clerk_user_id', agent.clerk_user_id);

        if (error) throw error;
        toast.success('Agent updated!');
      }

      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error('Operation failed', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isNew ? 'Add New Agent' : 'Edit Agent'}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={form.avatar_url} />
                <AvatarFallback>{form.full_name[0] || 'A'}</AvatarFallback>
              </Avatar>
              <Label htmlFor="avatar" className="cursor-pointer">
                <Button variant="outline" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                  {form.avatar_url ? 'Change' : 'Upload'} Photo
                </Button>
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </Label>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
            </div>

            <div>
              <Label>Email {isNew ? '' : '(cannot change)'}</Label>
              <Input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                disabled={!isNew}
                placeholder={isNew ? 'agent@example.com' : ''}
              />
            </div>

            <div>
              <Label>Phone</Label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>

            <div>
              <Label>Tagline</Label>
              <Input value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} />
            </div>

            <div>
              <Label>Bio</Label>
              <Textarea rows={4} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={saveAgent} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isNew ? 'Create Agent' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}