import * as React from 'react'
import { Subject } from 'rxjs'

export const SupplierInfoContext = React.createContext({})

export const onAddSupplierComment = new Subject()
