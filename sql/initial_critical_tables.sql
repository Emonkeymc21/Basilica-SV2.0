-- PostgreSQL - tablas críticas iniciales para MVP parroquial

CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(120) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email CITEXT UNIQUE NOT NULL,
  password_hash TEXT,
  full_name VARCHAR(160) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);

CREATE TABLE IF NOT EXISTS schedules (
  id TEXT PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('MASS','CONFESSION','ADORATION','OFFICE')),
  title VARCHAR(180),
  weekday SMALLINT NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  start_time CHAR(5) NOT NULL,
  end_time CHAR(5),
  location_label VARCHAR(180),
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  valid_from TIMESTAMPTZ,
  valid_to TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_schedules_type_weekday_active ON schedules(type, weekday, is_active);

CREATE TABLE IF NOT EXISTS event_categories (
  id TEXT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(140) UNIQUE NOT NULL,
  color VARCHAR(20),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title VARCHAR(220) NOT NULL,
  slug VARCHAR(240) UNIQUE NOT NULL,
  excerpt TEXT,
  description_html TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  all_day BOOLEAN NOT NULL DEFAULT FALSE,
  location_label VARCHAR(180),
  address TEXT,
  category_id TEXT REFERENCES event_categories(id) ON DELETE SET NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
  author_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_events_starts_at_status ON events(starts_at, status);
CREATE INDEX IF NOT EXISTS idx_events_featured_starts_at ON events(featured, starts_at);

CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  title VARCHAR(220) NOT NULL,
  slug VARCHAR(240) UNIQUE NOT NULL,
  excerpt TEXT,
  content_html TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  category_id TEXT,
  author_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  seo_title VARCHAR(255),
  seo_description VARCHAR(320),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_posts_status_published_at ON posts(status, published_at);

CREATE TABLE IF NOT EXISTS prayer_requests (
  id TEXT PRIMARY KEY,
  full_name VARCHAR(180),
  email VARCHAR(255),
  intention TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  allow_contact BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  ip_hash VARCHAR(255),
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_status_created_at ON prayer_requests(status, created_at);

CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  full_name VARCHAR(180) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(80),
  subject VARCHAR(180),
  message TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'NEW',
  ip_hash VARCHAR(255),
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  replied_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status_created_at ON contact_messages(status, created_at);
