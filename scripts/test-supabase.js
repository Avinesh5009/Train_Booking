const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Simple .env parser without external dependencies
try {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    lines.forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        process.env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '');
      }
    });
  }
} catch (e) {}

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://gevzqlphosoimdfpzmxx.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_0MP3wyOBRPeALzmkO0QSxg_9nsbulTK';

console.log('====================================================');
console.log('RailTicket — Supabase Connection & Health Check');
console.log('====================================================');
console.log('Supabase URL:', SUPABASE_URL);
console.log('Supabase Key:', SUPABASE_KEY.slice(0, 15) + '...');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkDatabase() {
  console.log('\n1. Testing query on "bookings" table...');
  const { data: bData, error: bErr } = await supabase.from('bookings').select('*').limit(5);

  if (bErr) {
    if (bErr.code === 'PGRST205' || bErr.message?.includes('schema cache')) {
      console.log('⚠️  Connected to Supabase successfully, but "public.bookings" table does not exist yet.');
      console.log('\n👉 HOW TO CREATE THE TABLE IN 1 MINUTE:');
      console.log('1. Go to your Supabase SQL Editor:');
      console.log('   https://supabase.com/dashboard/project/gevzqlphosoimdfpzmxx/sql/new');
      console.log('2. Open the file "supabase-schema.sql" in this project (or copy from the in-app modal).');
      console.log('3. Paste the SQL and click "Run".');
      console.log('4. Run this script again: node scripts/test-supabase.js');
    } else {
      console.error('❌ Supabase error:', bErr.message);
    }
  } else {
    console.log('✅ "bookings" table is READY and ACCESSIBLE in Supabase!');
    console.log(`   Found ${bData.length} booking records in the cloud database.`);
    if (bData.length > 0) {
      console.log('   Latest booking:', {
        pnr: bData[0].pnr,
        train: bData[0].train_name,
        date: bData[0].journey_date,
        total: bData[0].total_fare,
        status: bData[0].status,
      });
    }
  }
}

checkDatabase().catch(console.error);
