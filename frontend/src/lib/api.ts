import type { Project, SkillGroup, SocialLink } from '@/types/content'
import {
  fallbackProjects,
  fallbackSkillGroups,
  fallbackSocials,
} from '@/data/fallback'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) throw new Error(`Request to ${path} failed: ${res.status}`)
  return res.json() as Promise<T>
}

/** Fetches from the API, silently falling back to local content on failure. */
async function withFallback<T>(path: string, fallback: T): Promise<T> {
  try {
    return await getJson<T>(path)
  } catch {
    return fallback
  }
}

export function getProjects(): Promise<Project[]> {
  return withFallback('/api/projects', fallbackProjects)
}

export function getSkillGroups(): Promise<SkillGroup[]> {
  return withFallback('/api/skills', fallbackSkillGroups)
}

export function getSocials(): Promise<SocialLink[]> {
  return withFallback('/api/socials', fallbackSocials)
}

export interface ContactPayload {
  name: string
  email: string
  message: string
}

export interface ContactResult {
  ok: boolean
  error?: string
}

export async function sendContactMessage(
  payload: ContactPayload,
): Promise<ContactResult> {
  try {
    const res = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      return { ok: false, error: body?.detail ?? 'Something went wrong.' }
    }
    return { ok: true }
  } catch {
    return {
      ok: false,
      error: 'Could not reach the server. Please try again later.',
    }
  }
}
