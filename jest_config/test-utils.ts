// Setup react-testing-library
// https://testing-library.com/docs/react-testing-library/setup#custom-render
import { render } from '@testing-library/react';
// eslint-disable-next-line import/no-namespace
import * as ReactRedux from 'react-redux';
import { expectSaga } from 'redux-saga-test-plan';

import { SCHEMA_BASE } from '@database/data/schema';
import { marshallState } from '@services/Store/DataManager/utils';
import { AppState, persistenceSlice } from '@store';
import { DataStore, TAction } from '@types';
import { noOp } from '@utils';

import { ProvidersWrapper } from './providersWrapper';

// Workaround due to circular dependency issues
const APP_STATE = marshallState(SCHEMA_BASE);

// Mock features used by react-slider
window.matchMedia =
  window.matchMedia ||
  (() => ({
    matches: false,
    addListener: noOp,
    removeListener: noOp
  }));

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  ((callback) => {
    setTimeout(callback, 0);
  });

/**
 * For testing redux store interactions
 */
export const mockUseDispatch = () => {
  const mockDispatch = jest.fn();
  jest.spyOn(ReactRedux, 'useDispatch').mockReturnValue(mockDispatch);
  return mockDispatch;
};

export const actionWithPayload = (payload: any) => expect.objectContaining({ payload });

expectSaga.DEFAULT_TIMEOUT = 100;

// wrapper option : Wrap renders with our providers so components can consume it
export const simpleRender = (ui: React.ReactElement, options?: any) =>
  render(ui, { wrapper: ProvidersWrapper, ...options });

// Generate 'dispatch' for the reducer that is being tested
export const createStore = <S>(reducer: (state: S, action: TAction<any, any>) => S) => (
  action: TAction<any, any>
) => (state: S) => reducer(state, action);

// re-export everything
export * from '@testing-library/react';
export { ProvidersWrapper };
export * from 'redux-saga-test-plan';

/**
 * Provides a mock state. Can mock the entire DataStore of a specific key.
 */

export function mockAppState(sliceState?: Partial<DataStore>): AppState {
  if (sliceState) {
    return ({
      [persistenceSlice.name]: sliceState
    } as unknown) as AppState;
  } else {
    return ({
      [persistenceSlice.name]: APP_STATE
    } as unknown) as AppState;
  }
}
