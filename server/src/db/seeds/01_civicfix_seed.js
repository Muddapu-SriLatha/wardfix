const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Clear existing tables
  await knex('upvotes').del();
  await knex('comments').del();
  await knex('issues').del();
  await knex('categories').del();
  await knex('users').del();

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Seed Users (Indian Citizens & Municipal Officials)
  const [citizen1, citizen2, admin, worker] = await knex('users').insert([
    {
      email: 'aarav@civicfix.in',
      password_hash: passwordHash,
      full_name: 'Aarav Sharma',
      role: 'citizen',
      department: null,
    },
    {
      email: 'ananya@civicfix.in',
      password_hash: passwordHash,
      full_name: 'Ananya Rao',
      role: 'citizen',
      department: null,
    },
    {
      email: 'admin@bbmp.gov.in',
      password_hash: passwordHash,
      full_name: 'Er. Rajesh Kumar (Executive Engineer)',
      role: 'admin',
      department: 'BBMP Public Works & Roads (PWD)',
    },
    {
      email: 'swachh@mcd.gov.in',
      password_hash: passwordHash,
      full_name: 'Officer Priya Patel',
      role: 'admin',
      department: 'Solid Waste Management & Swachh Bharat',
    },
  ]).returning('*');

  // 2. Seed Categories (Indian Civic Categories with Hindi/English descriptions)
  const categories = await knex('categories').insert([
    {
      name: 'Pothole & Road Damage (सड़क के गड्ढे)',
      slug: 'pothole',
      description: 'Deep asphalt cracks, crater potholes on arterial roads causing traffic jams and vehicle hazards.',
      icon: 'alert-triangle',
      default_priority: 'high',
      sla_hours: 24,
    },
    {
      name: 'Open Manhole & Drainage Overflow (खुला मैनहोल व जलभराव)',
      slug: 'manhole',
      description: 'Missing drain covers, open storm-water manholes, and sewage waterlogging during rains.',
      icon: 'alert-circle',
      default_priority: 'urgent',
      sla_hours: 12,
    },
    {
      name: 'Uncollected Garbage & Dumping (कचरा व स्वच्छता)',
      slug: 'garbage',
      description: 'Overflowing dustbins, illegal garbage dumps on sidewalks, public health & sanitation risk.',
      icon: 'trash-2',
      default_priority: 'medium',
      sla_hours: 24,
    },
    {
      name: 'Broken Streetlight & Dark Spot (स्ट्रीट लाइट)',
      slug: 'streetlight',
      description: 'Faulty street lamps, non-functional sodium lights causing dark spots and pedestrian safety concerns.',
      icon: 'lightbulb-off',
      default_priority: 'medium',
      sla_hours: 48,
    },
    {
      name: 'Water Supply Leak & Main Burst (जल आपूर्ति समस्या)',
      slug: 'water_leak',
      description: 'Clean drinking water pipeline leakages, low pressure, or contaminated supply lines.',
      icon: 'droplet',
      default_priority: 'high',
      sla_hours: 24,
    },
    {
      name: 'Overhead Dangling Cable & Wire Hazard (बिजली के तार)',
      slug: 'dangling_wires',
      description: 'Hazardous hanging electrical wires, sparking transformers, or fallen fiber optic cables.',
      icon: 'zap',
      default_priority: 'urgent',
      sla_hours: 12,
    },
  ]).returning('*');

  const catPothole = categories.find(c => c.slug === 'pothole');
  const catManhole = categories.find(c => c.slug === 'manhole');
  const catGarbage = categories.find(c => c.slug === 'garbage');
  const catLight = categories.find(c => c.slug === 'streetlight');
  const catWater = categories.find(c => c.slug === 'water_leak');
  const catWires = categories.find(c => c.slug === 'dangling_wires');

  // 3. Seed Sample Issues with Indian PostGIS Geolocation Coordinates
  const issue1 = await knex('issues').insert({
    title: 'Hazardous Deep Pothole on MG Road near Trinity Metro',
    description: 'Dangerous 10-inch crater near Trinity Metro Station causing severe vehicle slowdowns and two-wheeler skid risk.',
    category_id: catPothole.id,
    reporter_id: citizen1.id,
    status: 'submitted',
    priority: 'high',
    image_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    latitude: 12.971600,
    longitude: 77.594600,
    address: 'MG Road, near Trinity Metro Station, Ward 111, Bengaluru, Karnataka 560001',
    neighborhood: 'Shanthala Nagar, Ashok Nagar',
    exif_data: JSON.stringify({
      hasGps: true,
      latitude: 12.971600,
      longitude: 77.594600,
      cameraMake: 'Samsung',
      cameraModel: 'Galaxy S24 Ultra',
      timestamp: '2026-08-16T08:30:00Z',
    }),
    ai_predicted_category: 'pothole',
    ai_confidence: 0.9680,
    upvotes_count: 34,
    assigned_department: 'BBMP PWD Infrastructure Wing',
  }).returning('id');

  const issue2 = await knex('issues').insert({
    title: 'Open Manhole and Waterlogging on 100ft Road, Indiranagar',
    description: 'Broken concrete lid on storm-water drain near 12th Main junction. High accident hazard for pedestrians during night.',
    category_id: catManhole.id,
    reporter_id: citizen2.id,
    status: 'in_progress',
    priority: 'urgent',
    image_url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80',
    latitude: 12.978400,
    longitude: 77.640800,
    address: '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
    neighborhood: 'Indiranagar Ward 80',
    exif_data: JSON.stringify({
      hasGps: true,
      latitude: 12.978400,
      longitude: 77.640800,
      cameraMake: 'Apple',
      cameraModel: 'iPhone 15 Pro',
      timestamp: '2026-08-15T18:45:00Z',
    }),
    ai_predicted_category: 'manhole',
    ai_confidence: 0.9420,
    upvotes_count: 52,
    assigned_department: 'BWSSB & Municipal Drainage Board',
  }).returning('id');

  const issue3 = await knex('issues').insert({
    title: 'Uncollected Garbage Dump near Connaught Place Outer Circle',
    description: 'Black spot waste dumping overflowing onto walking path near Kasturba Gandhi Marg crossing.',
    category_id: catGarbage.id,
    reporter_id: citizen1.id,
    status: 'submitted',
    priority: 'medium',
    image_url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    latitude: 28.613900,
    longitude: 77.209000,
    address: 'KG Marg Crossing, Connaught Place, New Delhi, Delhi 110001',
    neighborhood: 'NDMC Central Zone',
    exif_data: JSON.stringify({
      hasGps: true,
      latitude: 28.613900,
      longitude: 77.209000,
      cameraMake: 'Xiaomi',
      cameraModel: 'Redmi Note 13',
      timestamp: '2026-08-14T07:15:00Z',
    }),
    ai_predicted_category: 'garbage',
    ai_confidence: 0.9150,
    upvotes_count: 19,
    assigned_department: 'MCD Swachh Bharat Solid Waste Cell',
  }).returning('id');

  const issue4 = await knex('issues').insert({
    title: 'Dangling Electricity Cables near Bandra Station West',
    description: 'Low-hanging power cables near bus stop posing electrocution risk to commuters.',
    category_id: catWires.id,
    reporter_id: citizen2.id,
    status: 'resolved',
    priority: 'urgent',
    image_url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80',
    latitude: 19.059600,
    longitude: 72.829500,
    address: 'Station Road, Bandra West, Mumbai, Maharashtra 400050',
    neighborhood: 'H West Ward, BMC',
    exif_data: JSON.stringify({
      hasGps: true,
      latitude: 19.059600,
      longitude: 72.829500,
      cameraMake: 'OnePlus',
      cameraModel: 'OnePlus 12',
      timestamp: '2026-08-12T11:00:00Z',
    }),
    ai_predicted_category: 'dangling_wires',
    ai_confidence: 0.9510,
    upvotes_count: 41,
    assigned_department: 'BEST & MSEDCL Electrical Dept',
    resolution_notes: 'Bundled and elevated hanging communication and power cables. Re-anchored to utility pole.',
    resolved_at: new Date('2026-08-13T14:20:00Z'),
  }).returning('id');

  const issue5 = await knex('issues').insert({
    title: 'Non-Functional Streetlight Grid on Hitec City Flyover',
    description: '5 consecutive street lamps non-operational causing dark stretch on Cyber Towers flyover road.',
    category_id: catLight.id,
    reporter_id: citizen1.id,
    status: 'in_progress',
    priority: 'medium',
    image_url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80',
    latitude: 17.443500,
    longitude: 78.377200,
    address: 'Cyber Towers Junction, Hitec City, Hyderabad, Telangana 500081',
    neighborhood: 'GHMC Serilingampally Zone',
    exif_data: JSON.stringify({
      hasGps: true,
      latitude: 17.443500,
      longitude: 78.377200,
      cameraMake: 'Google',
      cameraModel: 'Pixel 8',
      timestamp: '2026-08-13T20:10:00Z',
    }),
    ai_predicted_category: 'streetlight',
    ai_confidence: 0.8990,
    upvotes_count: 27,
    assigned_department: 'GHMC Electrical & Lighting Division',
  }).returning('id');

  // Update PostGIS location geometry points for seeded Indian issues
  await knex.raw(`
    UPDATE issues 
    SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326);
  `);

  // 4. Seed Comments
  const issue1Id = issue1[0].id || issue1[0];
  await knex('comments').insert([
    {
      issue_id: issue1Id,
      user_id: admin.id,
      content: 'BBMP East Zone PWD maintenance vehicle dispatched with asphalt mixture for cold patching.',
      is_internal: false,
      status_change: 'verified',
    },
    {
      issue_id: issue1Id,
      user_id: citizen1.id,
      content: 'Thank you Er. Rajesh! Monsoon rains made this crater wider today.',
      is_internal: false,
    },
  ]);

  console.log('PostGIS database seeded with Indian municipal dataset successfully!');
};

