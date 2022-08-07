import { Dimensions } from 'react-native'
import { BehaviorSubject, Observable } from 'rxjs'

export enum Orientation {
  Portrait,
  Landscape,
}

interface DimensionSpecifics<T> {
  portrait?: T
  landscape?: T
  default?: T
}

export type DimensionResult = {
  value: Orientation
  isPortrait: boolean
  isLandscape: boolean
}

export class Dimension {
  private readonly _subject: BehaviorSubject<DimensionResult>

  constructor() {
    this._subject = new BehaviorSubject<DimensionResult>(
      this.createObject(Dimension.currentMode)
    )

    Dimensions.addEventListener('change', () => {
      this._subject.next(this.createObject(Dimension.currentMode))
    })
  }

  createObject = (value: Orientation) => {
    return {
      value,
      get isPortrait() {
        return Dimension.isPortrait
      },
      get isLandscape() {
        return Dimension.isLandscape
      },
    }
  }

  static get currentMode() {
    return Dimension.isPortrait ? Orientation.Portrait : Orientation.Landscape
  }

  static get isPortrait() {
    const dim = Dimensions.get('screen')
    return dim.height >= dim.width
  }

  static get isLandscape() {
    return !Dimension.isPortrait
  }

  static select<T>(specifics: DimensionSpecifics<T>): T {
    if (Dimension.isPortrait) {
      return specifics.portrait
    }

    if (Dimension.isLandscape) {
      return specifics.landscape
    }

    return specifics.default
  }

  observer = () => {
    return this._subject
  }

  static onChange = () => {
    return new Observable<Orientation>(observer => {
      Dimensions.addEventListener('change', () => {
        const value = Dimension.isPortrait
          ? Orientation.Portrait
          : Orientation.Landscape

        observer.next(value)
      })
    })
  }
}
