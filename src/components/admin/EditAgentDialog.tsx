// src/components/admin/EditAgentDialog.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { createAgent } from '@/actions/createAgent';

type Props = {
  agent?: any;                    // keeps AdminDashboard happy
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export default function EditAgentDialog({ open, onOpenChange, onSuccess }: Props) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!fullName.trim() || !email.trim()) {
      toast.error('Full name and email are required');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('full_name', fullName.trim());
    formData.append('email', email.trim().toLowerCase());

    const result = await createAgent(formData);

    if (result.success) {
      toast.success('Agent created successfully!');
      setFullName('');
      setEmail('');
      onSuccess();               // refreshes the list
      onOpenChange(false);
    } else {
      toast.error('Failed to create agent', {
        description: result.error || 'Unknown error',
      });
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Agent</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@company.com"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating…' : 'Create Agent'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}