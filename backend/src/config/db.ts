import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// We use the service role key to bypass RLS in the backend
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
