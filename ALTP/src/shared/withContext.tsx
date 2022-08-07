import hoistNonReactStatics from 'hoist-non-react-statics'
import * as React from 'react'

export function withContext(Consumer: any): any {
  return (WrappedComponent: any) => {
    class Enhance extends React.PureComponent<any> {
      render() {
        const { forwardRef, ...rest } = this.props
        return (
          <Consumer>
            {context => (
              <WrappedComponent {...rest} ref={forwardRef} {...context} />
            )}
          </Consumer>
        )
      }
    }

    hoistNonReactStatics(Enhance, WrappedComponent)

    return Enhance
  }
}
