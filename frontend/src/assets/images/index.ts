import abstractBg from './abstract-bg.webp'
import abstractBg2 from './abstract-bg-2.webp'
import abstractBg3 from './abstract-bg-3.webp'
import abstractBg4 from './abstract-bg-4.webp'
import abstractBg5 from './abstract-bg-5.webp'
import abstractBg6 from './abstract-bg-6.webp'
import abstractBg7 from './abstract-bg-7.webp'
import abstractBgPlaceholder from './abstract-bg-placeholder.webp'
import abstractBg2Placeholder from './abstract-bg-2-placeholder.webp'
import abstractBg3Placeholder from './abstract-bg-3-placeholder.webp'
import abstractBg4Placeholder from './abstract-bg-4-placeholder.webp'
import abstractBg5Placeholder from './abstract-bg-5-placeholder.webp'
import abstractBg6Placeholder from './abstract-bg-6-placeholder.webp'
import abstractBg7Placeholder from './abstract-bg-7-placeholder.webp'
import architechProject from './architech-project.webp'
import asItWas from './As It Was.jpg'
import avatar from './avatar.png'
import avatar2 from './avatar-2.png'
import blindingLights from './Blinding Lights.jpg'
import instantCrush from './Instant Crush.jpg'
import lendoraProject from './lendora-project.png'
import mapManaus from './map-manaus.webp'
import passionfruit from './Passionfruit.jpg'
import pride from './PRIDE..jpg'
import redbone from './Redbone.jpg'
import iWonder from './I Wonder.jpg'
import whisperMyName from './Whisper My Name.jpg'

export const images = {
  abstractBg,
  abstractBg2,
  abstractBg3,
  abstractBg4,
  abstractBg5,
  abstractBg6,
  abstractBg7,
  architechProject,
  asItWas,
  avatar,
  avatar2,
  blindingLights,
  instantCrush,
  lendoraProject,
  mapManaus,
  passionfruit,
  pride,
  redbone,
  iWonder,
  whisperMyName,
}

// Each background is paired with a ~250-byte, 32px-wide copy of itself.
// That's under Vite's asset inline limit, so it ships as a data: URI inside
// the JS bundle and can paint (blurred) on the very first frame, while the
// full-size image — still a few hundred KB — downloads behind it.
export const abstractBackgrounds = [
  { src: abstractBg, placeholder: abstractBgPlaceholder },
  { src: abstractBg2, placeholder: abstractBg2Placeholder },
  { src: abstractBg3, placeholder: abstractBg3Placeholder },
  { src: abstractBg4, placeholder: abstractBg4Placeholder },
  { src: abstractBg5, placeholder: abstractBg5Placeholder },
  { src: abstractBg6, placeholder: abstractBg6Placeholder },
  { src: abstractBg7, placeholder: abstractBg7Placeholder },
]
