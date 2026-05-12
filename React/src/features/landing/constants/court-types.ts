import tennisImg from '@/assets/images/tennis-court.webp'
import padelImg from '@/assets/images/padel-court.webp'
import beachTennisImg from '@/assets/images/beach-tennis-court.webp'

export const courtTypes = [
  {
    id: 'padel',
    nameKey: 'landing.courts.padel.name',
    descriptionKey: 'landing.courts.padel.description',
    icon: 'PADLE',
    image: padelImg
  },
  {
    id: 'tennis',
    nameKey: 'landing.courts.tennis.name',
    descriptionKey: 'landing.courts.tennis.description',
    icon: 'TENNIS',
    image: tennisImg
  },
  {
    id: 'beach-tennis',
    nameKey: 'landing.courts.beachTennis.name',
    descriptionKey: 'landing.courts.beachTennis.description',
    icon: 'BEACH_TENNIS',
    image: beachTennisImg
  }
]
