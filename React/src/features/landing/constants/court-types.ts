import soccerImg from '@/assets/images/soccer-court.png'
import tennisImg from '@/assets/images/tennis-court.png'
import multisportImg from '@/assets/images/multisport-court.png'
export const courtTypes = [
  {
    id: 'padle',
    name: 'Padel',
    description: 'Gerencie quadras de padel com grades de horários configuráveis e controle de reservas.',
    icon: 'PADLE',
    image: tennisImg
  },
  {
    id: 'tennis',
    name: 'Tênis',
    description: 'Suporte a quadras de tênis com slots personalizados por duração e capacidade.',
    icon: 'TENNIS',
    image: tennisImg
  },
  {
    id: 'beach-tennis',
    name: 'Beach Tennis',
    description: 'Administre quadras de beach tennis com agendamento online para seus jogadores.',
    icon: 'BEACH_TENNIS',
    image: multisportImg
  }

]
