import * as React from 'react'
import { Subject } from 'rxjs'

export const SampleInfoContext = React.createContext({})

export const onAddSampleComment = new Subject()
