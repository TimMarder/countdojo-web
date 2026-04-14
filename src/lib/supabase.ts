import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oxvnbbtqwfqkdphvdhwu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94dm5iYnRxd2Zxa2RwaHZkaHd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNzgwNjgsImV4cCI6MjA5MDg1NDA2OH0.PkO4mLL_B7Xkjo3depk7FlcAPP2usuqjUgA7zgw5yb8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
