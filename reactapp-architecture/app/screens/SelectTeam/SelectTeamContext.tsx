import * as React from 'react'
import { Team } from '@/models/common'

export interface SelectTeamContextType {
  selectTeam: (team: Team) => void
  createTeam: () => void
}

export const SelectTeamContext = React.createContext<SelectTeamContextType>({
  selectTeam: () => {},
  createTeam: () => {},
})
