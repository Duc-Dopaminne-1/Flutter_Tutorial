import { BehaviorSubject, Subject } from 'rxjs'

export const showChoose = new Subject<{ answear: string }>()
export const updateScoreAtHome = new Subject()
export const help5050 = new Subject()
export const helpUsers = new Subject()
export const showTimer = new Subject()
export const timeChoose = new Subject()
export const socketRoom = new Subject()
export const showModalHelp = new Subject()
export const isVisibleTabBar = new Subject()
export const isSelectMulti = new Subject<boolean>()
export const totalSelectMulti = new Subject<number>()
