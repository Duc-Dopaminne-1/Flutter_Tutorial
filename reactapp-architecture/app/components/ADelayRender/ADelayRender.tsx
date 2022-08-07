import React from 'react'

type DelayRenderArgs = Readonly<{
  delay: number
  onRender?: () => void
}>

export const DelayRender = (
  args: DelayRenderArgs = {
    delay: 0,
  }
): any => (Element: any) =>
  class DelayRender extends React.PureComponent<any> {
    _timer: NodeJS.Timeout

    readonly state = {
      ready: true,
    }

    componentWillMount() {
      const { delay, onRender } = args
      if (delay && delay > 0) {
        this.setState({ ready: false })
        this._timer = setTimeout(() => {
          this.setState({ ready: true })
          if (onRender && typeof onRender === 'function') {
            onRender()
          }
        }, delay)
      } else {
        this.setState({ ready: true })
      }
    }

    componentWillUnmount() {
      if (this._timer) {
        clearTimeout(this._timer)
      }
    }

    render() {
      if (this.state.ready) {
        return <Element {...this.props} />
      }
      return null
    }
  }
