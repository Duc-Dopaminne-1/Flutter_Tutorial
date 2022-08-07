# React Native Auth

React Native Auth work with redux and redux saga to handle authetication.

### Setup

- Add auth reducer to redux
  ```
  import { reducer as userReducer } from '@hd/auth';
  const rootReducer = combineReducers({
    // ...your other reducers here
    user: userReducer
  })
  ```
- Add auth saga to your root saga
  ```
  import { createSaga } from '@hd/auth/';
  function* rootSaga() {
    yield all([
      // ... your other sagas here
      fork(authSaga(opts*))
    ]);
  };
  ```
  [**_opts_** (optional)](./docs/options.md)

### Usage

    ```
    import { DispatchProps, actions as authActions } from '@hd/auth';
    const WithAuthComponent = connect({
        state: (state: any) => ({ user: state.user }),
        actions: authActions,
    })(YourComponent);
    ```

### Functions

[**_view all functions_**](./docs/functions.md)
