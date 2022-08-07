import * as React from 'react'
import { Subject } from 'rxjs'

export const ProductInfoContext = React.createContext({})

export const onAddProductComment = new Subject()
