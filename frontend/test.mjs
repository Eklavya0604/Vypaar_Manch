import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('../../backend/.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function test() {
  const r1 = await supabase.from('businesses').select('*').limit(1);
  console.log('businesses:', r1.error ? r1.error.message : r1.data);
  const r2 = await supabase.from('Business').select('*').limit(1);
  console.log('Business:', r2.error ? r2.error.message : r2.data);
}
test();
