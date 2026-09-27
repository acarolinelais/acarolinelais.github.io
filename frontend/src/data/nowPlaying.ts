import { images } from '@/assets/images'

export interface Track {
  title: string
  artist: string
  cover: string
}

// Curated list: YouTube Music has no public "now playing" API.
export const nowPlayingTracks: Track[] = [
  {
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    cover: images.blindingLights,
  },
  {
    title: 'As It Was',
    artist: 'Harry Styles',
    cover: images.asItWas,
  },
  {
    title: 'Instant Crush',
    artist: 'Daft Punk ft. Julian Casablancas',
    cover: images.instantCrush,
  },
  {
    title: 'Redbone',
    artist: 'Childish Gambino',
    cover: images.redbone,
  },
  {
    title: 'PRIDE.',
    artist: 'Kendrick Lamar',
    cover: images.pride,
  },
  {
    title: 'Passionfruit',
    artist: 'Drake',
    cover: images.passionfruit,
  },
  {
    title: 'I Wonder',
    artist: 'Kanye West',
    cover: images.iWonder,
  },
  {
    title: 'Whisper My Name',
    artist: 'Drake',
    cover: images.whisperMyName,
  },
]
