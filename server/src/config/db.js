const knex = require('knex');
const knexConfig = require('../../knexfile');
const bcrypt = require('bcryptjs');

// Create knex instance synchronously with SQLite in-memory engine by default
const dbKnex = knex({
  client: 'sqlite3',
  connection: {
    filename: ':memory:',
  },
  useNullAsDefault: true,
});

let isPostgresAvailable = false;

async function setupTablesAndSeed() {
  await dbKnex.schema.createTable('users', (t) => {
    t.increments('id').primary();
    t.string('email').unique();
    t.string('password_hash');
    t.string('full_name');
    t.string('role').defaultTo('citizen');
    t.string('department');
    t.timestamp('created_at').defaultTo(dbKnex.fn.now());
  });

  await dbKnex.schema.createTable('categories', (t) => {
    t.increments('id').primary();
    t.string('name').unique();
    t.string('slug').unique();
    t.text('description');
    t.string('icon').defaultTo('alert-circle');
    t.string('default_priority').defaultTo('medium');
    t.integer('sla_hours').defaultTo(48);
  });

  await dbKnex.schema.createTable('issues', (t) => {
    t.increments('id').primary();
    t.string('title');
    t.text('description');
    t.integer('category_id').references('id').inTable('categories');
    t.integer('reporter_id').references('id').inTable('users');
    t.string('status').defaultTo('submitted');
    t.string('priority').defaultTo('medium');
    t.string('image_url');
    t.float('latitude');
    t.float('longitude');
    t.text('address');
    t.string('neighborhood');
    t.text('exif_data');
    t.string('ai_predicted_category');
    t.float('ai_confidence');
    t.integer('upvotes_count').defaultTo(0);
    t.integer('duplicate_count').defaultTo(1);
    t.integer('parent_issue_id').references('id').inTable('issues');
    t.string('voice_note_url');
    t.text('voice_transcript');
    t.string('voice_language');
    t.string('assigned_department');
    t.string('assigned_contractor');
    t.text('resolution_notes');
    t.timestamp('resolved_at');
    t.timestamp('created_at').defaultTo(dbKnex.fn.now());
    t.timestamp('updated_at').defaultTo(dbKnex.fn.now());
  });

  await dbKnex.schema.createTable('comments', (t) => {
    t.increments('id').primary();
    t.integer('issue_id').references('id').inTable('issues');
    t.integer('user_id').references('id').inTable('users');
    t.text('content');
    t.boolean('is_internal').defaultTo(false);
    t.string('status_change');
    t.timestamp('created_at').defaultTo(dbKnex.fn.now());
  });

  await dbKnex.schema.createTable('upvotes', (t) => {
    t.increments('id').primary();
    t.integer('issue_id').references('id').inTable('issues');
    t.integer('user_id').references('id').inTable('users');
    t.timestamp('created_at').defaultTo(dbKnex.fn.now());
  });

  const passHash = await bcrypt.hash('password123', 10);

  const [citizenId] = await dbKnex('users').insert({
    email: 'aarav@civicfix.in',
    password_hash: passHash,
    full_name: 'Aarav Sharma',
    role: 'citizen',
  });

  const [adminId] = await dbKnex('users').insert({
    email: 'admin@bbmp.gov.in',
    password_hash: passHash,
    full_name: 'Er. Rajesh Kumar',
    role: 'admin',
    department: 'BBMP Public Works & Roads (PWD)',
  });

  const [contractorId] = await dbKnex('users').insert({
    email: 'contractor@pwd.gov.in',
    password_hash: passHash,
    full_name: 'Suresh Reddy (PWD Contractor)',
    role: 'contractor',
  });

  await dbKnex('categories').insert([
    { name: 'Pothole & Damaged Road (गड्ढे व सड़क क्षति)', slug: 'pothole', icon: 'disc', default_priority: 'high', sla_hours: 24 },
    { name: 'Open Manhole & Drainage Overflow (खुला मैनहोल व जलभराव)', slug: 'manhole', icon: 'alert-circle', default_priority: 'urgent', sla_hours: 12 },
    { name: 'Uncollected Garbage & Dumping (कचरा व स्वच्छता)', slug: 'garbage', icon: 'trash-2', default_priority: 'medium', sla_hours: 24 },
    { name: 'Broken Streetlight & Dark Spot (स्ट्रीट लाइट)', slug: 'streetlight', icon: 'lightbulb-off', default_priority: 'medium', sla_hours: 48 },
    { name: 'Water Supply Leak & Main Burst (जल आपूर्ति समस्या)', slug: 'water_leak', icon: 'droplet', default_priority: 'high', sla_hours: 24 },
    { name: 'Overhead Dangling Cable & Wire Hazard (बिजली के तार)', slug: 'dangling_wires', icon: 'zap', default_priority: 'urgent', sla_hours: 12 },
    { name: 'Coal Dust & Mining Pollution (कोयला धूल व खदान प्रदूषण)', slug: 'coal_pollution', icon: 'wind', default_priority: 'urgent', sla_hours: 12 },
  ]);

  await dbKnex('issues').insert([
    {
      title: 'Severe Airborne Coal Dust Pollution & Uncovered Transport Trucking near Bank More',
      description: 'Uncovered coal dump trucks traveling from Jharia coalfield belt depositing thick black coal dust layers across Bank More market road causing severe respiratory hazards and reduced visibility.',
      category_id: 7,
      reporter_id: citizenId,
      status: 'submitted',
      priority: 'urgent',
      image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      latitude: 23.795700,
      longitude: 86.430400,
      address: 'Bank More Market Junction, Jharia Road, Dhanbad, Jharkhand 826001',
      neighborhood: 'Bank More Ward 14, Dhanbad Municipal Corporation',
      exif_data: JSON.stringify({ hasGps: true, latitude: 23.795700, longitude: 86.430400, cameraMake: 'Samsung', cameraModel: 'Galaxy S24 Ultra' }),
      ai_predicted_category: 'coal_pollution',
      ai_confidence: 0.9780,
      upvotes_count: 42,
      assigned_department: 'Dhanbad Municipal Corporation (DMC) & JSPCB Environmental Cell',
    },
    {
      title: 'Black Coal Slag & Slurry Runoff Blocking Drainage near Saraidhela',
      description: 'Accumulated coal slag slurry washed down from nearby coal processing area, completely clogging storm-water drainage channels near Saraidhela main market.',
      category_id: 7,
      reporter_id: citizenId,
      status: 'in_progress',
      priority: 'high',
      image_url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
      latitude: 23.812400,
      longitude: 86.442100,
      address: 'Saraidhela Main Road near Steel Gate, Dhanbad, Jharkhand 826004',
      neighborhood: 'Saraidhela Ward 22, Dhanbad',
      exif_data: JSON.stringify({ hasGps: true, latitude: 23.812400, longitude: 86.442100, cameraMake: 'Apple', cameraModel: 'iPhone 15 Pro' }),
      ai_predicted_category: 'coal_pollution',
      ai_confidence: 0.9450,
      upvotes_count: 28,
      assigned_department: 'DMC Health & Public Drainage Department',
    },
    {
      title: 'Deep Coal Tipper Crater Pothole on Jharia-Dhanbad Main Road',
      description: 'Heavy coal transport vehicles caused severe asphalt subsidence and waterlogged coal slurry pit near Dhansar Chowk.',
      category_id: 1,
      reporter_id: citizenId,
      status: 'submitted',
      priority: 'medium',
      image_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      latitude: 23.774500,
      longitude: 86.419800,
      address: 'Dhansar Chowk, Jharia Main Road, Dhanbad, Jharkhand 826001',
      neighborhood: 'Dhansar Ward 18, Dhanbad',
      exif_data: JSON.stringify({ hasGps: true, latitude: 23.774500, longitude: 86.419800, cameraMake: 'Xiaomi', cameraModel: 'Redmi Note 13' }),
      ai_predicted_category: 'pothole',
      ai_confidence: 0.9320,
      assigned_department: 'PWD Dhanbad Road Division',
    },
    {
      title: 'Severe Airborne Coal Dust & Heavy Mining Dumping',
      description: 'Thick airborne coal dust cloud from unmonitored coal overburden dumping yard near Katras Road causing respiratory distress and black dust settling on residential roofs.',
      category_id: 7,
      reporter_id: citizenId,
      status: 'submitted',
      priority: 'urgent',
      image_url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
      latitude: 23.801200,
      longitude: 86.425500,
      address: 'Katras Main Road Junction, Dhanbad, Jharkhand 826001',
      neighborhood: 'Katras Ward 10, Dhanbad',
      exif_data: JSON.stringify({ hasGps: true, latitude: 23.801200, longitude: 86.425500, cameraMake: 'OnePlus', cameraModel: '12 Pro' }),
      ai_predicted_category: 'coal_pollution',
      ai_confidence: 0.9820,
      assigned_department: 'JSPCB Environmental Cell & Coal Mine Safety Authority',
    },
  ]);

  console.log('✅ Indian civic dataset initialized for local database fallback!');
}

setupTablesAndSeed().catch((err) => console.error('Database setup error:', err));

module.exports = {
  knex: dbKnex,
  isPostgresAvailable: false,
};

