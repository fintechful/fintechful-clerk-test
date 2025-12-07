// src/app/test/page.tsx
import { supabase } from '@/lib/supabase';

export default async function TestPage() {
  const { data, error } = await supabase
    .from('smbs')
    .select('*')
    .limit(10);

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', background: '#000', color: '#0f0' }}>
      <h1>SUPABASE DIRECT TEST</h1>
      <pre>{JSON.stringify({ data, error }, null, 2)}</pre>
    </div>
  );
}