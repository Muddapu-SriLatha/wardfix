/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // 1. Enable PostGIS Extension
  await knex.raw('CREATE EXTENSION IF NOT EXISTS postgis;');

  // 2. Create Users Table
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email', 255).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.string('full_name', 255).notNullable();
    table.string('role', 50).notNullable().defaultTo('citizen'); // 'citizen', 'admin'
    table.string('department', 100).nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // 3. Create Categories Table
  await knex.schema.createTable('categories', (table) => {
    table.increments('id').primary();
    table.string('name', 100).notNullable().unique();
    table.string('slug', 100).notNullable().unique();
    table.text('description').nullable();
    table.string('icon', 100).defaultTo('alert-circle');
    table.string('default_priority', 20).defaultTo('medium');
    table.integer('sla_hours').defaultTo(48);
  });

  // 4. Create Issues Table with Spatial Geometry
  await knex.schema.createTable('issues', (table) => {
    table.increments('id').primary();
    table.string('title', 255).notNullable();
    table.text('description').notNullable();
    table.integer('category_id').unsigned().references('id').inTable('categories').onDelete('SET NULL');
    table.integer('reporter_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.string('status', 50).notNullable().defaultTo('submitted'); // 'submitted', 'verified', 'in_progress', 'resolved', 'rejected'
    table.string('priority', 20).notNullable().defaultTo('medium'); // 'low', 'medium', 'high', 'urgent'
    table.string('image_url', 512).nullable();
    table.specificType('latitude', 'numeric(10, 8)').notNullable();
    table.specificType('longitude', 'numeric(11, 8)').notNullable();
    table.text('address').nullable();
    table.string('neighborhood', 150).nullable();
    table.jsonb('exif_data').nullable();
    table.string('ai_predicted_category', 100).nullable();
    table.specificType('ai_confidence', 'numeric(5, 4)').nullable();
    table.integer('upvotes_count').defaultTo(0);
    table.integer('duplicate_count').defaultTo(1);
    table.integer('parent_issue_id').unsigned().nullable().references('id').inTable('issues').onDelete('SET NULL');
    table.string('voice_note_url', 512).nullable();
    table.text('voice_transcript').nullable();
    table.string('voice_language', 50).nullable();
    table.string('assigned_department', 100).nullable();
    table.text('resolution_notes').nullable();
    table.timestamp('resolved_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Add PostGIS Geometry Column & Index
  await knex.raw(`
    SELECT AddGeometryColumn('issues', 'location', 4326, 'POINT', 2);
    CREATE INDEX idx_issues_location ON issues USING GIST (location);
  `);

  // 5. Create Comments Table
  await knex.schema.createTable('comments', (table) => {
    table.increments('id').primary();
    table.integer('issue_id').unsigned().notNullable().references('id').inTable('issues').onDelete('CASCADE');
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.text('content').notNullable();
    table.boolean('is_internal').defaultTo(false);
    table.string('status_change', 50).nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // 6. Create Upvotes Table
  await knex.schema.createTable('upvotes', (table) => {
    table.increments('id').primary();
    table.integer('issue_id').unsigned().notNullable().references('id').inTable('issues').onDelete('CASCADE');
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.unique(['issue_id', 'user_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('upvotes');
  await knex.schema.dropTableIfExists('comments');
  await knex.schema.dropTableIfExists('issues');
  await knex.schema.dropTableIfExists('categories');
  await knex.schema.dropTableIfExists('users');
};
