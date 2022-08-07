import { Action, Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/*
 * <TStateProps = {}, TDispatchProps = {}, TOwnProps = {}, State = {}>(
 *     mapStateToProps: MapStateToPropsParam<TStateProps, TOwnProps, State>,
 *     mapDispatchToProps: MapDispatchToPropsNonObject<TDispatchProps, TOwnProps>
 * ): InferableComponentEnhancerWithProps<TStateProps & TDispatchProps, TOwnProps>;
 */

function connectHelper<TOwnProps>({ state, actions }: { state: (state: any, ownProps: TOwnProps) => any; actions: any }) {
  const mapStateToProps = (rootState: any, ownProps: TOwnProps) => state(rootState, ownProps);
  const mapDispatchToProps = (dispatch: Dispatch<Action>): any => bindActionCreators(actions, dispatch);
  return (Component: any) =>
    connect<any, any, TOwnProps, any>(mapStateToProps, mapDispatchToProps, null, {
      forwardRef: true,
    })(Component);
}

export default connectHelper;
