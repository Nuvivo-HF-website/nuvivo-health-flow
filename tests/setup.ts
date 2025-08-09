import { vi } from 'vitest';

// Mock environment variables
process.env.NODE_ENV = 'test';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
};

// Mock Supabase functions invoke for local testing
vi.mock('@supabase/supabase-js', async () => {
  const actual = await vi.importActual('@supabase/supabase-js');
  return {
    ...actual,
    createClient: vi.fn(() => ({
      auth: {
        signInWithPassword: vi.fn(() => Promise.resolve({
          data: { session: { access_token: 'mock-token' } },
          error: null
        })),
        getUser: vi.fn(() => Promise.resolve({
          data: { user: { id: 'test-user-123' } },
          error: null
        }))
      },
      from: vi.fn(() => ({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({
              data: { id: 'test-result-123' },
              error: null
            }))
          }))
        })),
        upsert: vi.fn(() => Promise.resolve({ error: null })),
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({
              data: { ai_summary: 'test summary', ai_generated_at: new Date().toISOString() },
              error: null
            }))
          }))
        })),
        delete: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ error: null }))
        }))
      })),
      functions: {
        invoke: vi.fn(() => Promise.resolve({
          data: { ai_summary: 'Mock AI summary for testing purposes.' },
          error: null
        }))
      }
    }))
  };
});