export const FALLBACK_ISSUES = [
  {
    id: 1,
    title: 'Severe Airborne Coal Dust Pollution & Uncovered Transport Trucking near Bank More',
    description: 'Uncovered coal dump trucks traveling from Jharia coalfield belt depositing thick black coal dust layers across Bank More market road causing severe respiratory hazards and reduced visibility.',
    category_name: 'Coal Dust & Mining Pollution',
    ai_predicted_category: 'coal_pollution',
    status: 'submitted',
    priority: 'urgent',
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    latitude: 23.7957,
    longitude: 86.4304,
    address: 'Bank More Market Junction, Jharia Road, Dhanbad, Jharkhand 826001',
    neighborhood: 'Bank More Ward 14, Dhanbad Municipal Corporation',
    assigned_department: 'Dhanbad Municipal Corporation (DMC) & JSPCB Environmental Cell',
    upvotes_count: 42,
    sla_hours: 12
  },
  {
    id: 2,
    title: 'Black Coal Slag & Slurry Runoff Blocking Drainage near Saraidhela',
    description: 'Accumulated coal slag slurry washed down from nearby coal processing area, completely clogging storm-water drainage channels near Saraidhela main market.',
    category_name: 'Coal Dust & Mining Pollution',
    ai_predicted_category: 'coal_pollution',
    status: 'in_progress',
    priority: 'high',
    image_url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    latitude: 23.8124,
    longitude: 86.4421,
    address: 'Saraidhela Main Road near Steel Gate, Dhanbad, Jharkhand 826004',
    neighborhood: 'Saraidhela Ward 22, Dhanbad',
    assigned_department: 'DMC Health & Public Drainage Department',
    upvotes_count: 28,
    sla_hours: 24
  },
  {
    id: 3,
    title: 'Deep Coal Tipper Crater Pothole on Jharia-Dhanbad Main Road',
    description: 'Heavy coal transport vehicles caused severe asphalt subsidence and waterlogged coal slurry pit near Dhansar Chowk.',
    category_name: 'Pothole & Damaged Road',
    ai_predicted_category: 'pothole',
    status: 'submitted',
    priority: 'medium',
    image_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    latitude: 23.7745,
    longitude: 86.4198,
    address: 'Dhansar Chowk, Jharia Main Road, Dhanbad, Jharkhand 826001',
    neighborhood: 'Dhansar Ward 18, Dhanbad',
    assigned_department: 'PWD Dhanbad Road Division',
    upvotes_count: 19,
    sla_hours: 48
  },
  {
    id: 4,
    title: 'Severe Airborne Coal Dust & Heavy Mining Dumping',
    description: 'Thick airborne coal dust cloud from unmonitored coal overburden dumping yard near Katras Road causing respiratory distress and black dust settling on residential roofs.',
    category_name: 'Coal Dust & Mining Pollution',
    ai_predicted_category: 'coal_pollution',
    status: 'submitted',
    priority: 'urgent',
    image_url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
    latitude: 23.8012,
    longitude: 86.4255,
    address: 'Katras Main Road Junction, Dhanbad, Jharkhand 826001',
    neighborhood: 'Katras Ward 10, Dhanbad',
    assigned_department: 'JSPCB Environmental Cell & Coal Mine Safety Authority',
    upvotes_count: 34,
    sla_hours: 12
  }
];

export const getLocalIssues = () => {
  try {
    const saved = localStorage.getItem('wardfix_user_issues');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading local issues:', e);
  }
  return FALLBACK_ISSUES;
};

export const addLocalIssue = (newIssue) => {
  try {
    const current = getLocalIssues();
    const updated = [newIssue, ...current];
    localStorage.setItem('wardfix_user_issues', JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving local issue:', e);
    return [newIssue, ...FALLBACK_ISSUES];
  }
};
