// test-utils.js
import React, { ReactElement } from 'react';
import { render as rtlRender, RenderResult } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { AppStore, RootState } from './app/store';
import { rootReducer } from './app/rootReducer';
// Import your own reducer

type StatefulRenderOptions = {
  initialState?: RootState;
  store?: AppStore;
};

const render = (
  ui: ReactElement,
  { initialState, store = createStore(rootReducer, initialState), ...renderOptions }: StatefulRenderOptions = {},
): RenderResult => {
  // eslint-disable-next-line react/prop-types
  const Wrapper: React.FC = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

// re-export everything
export * from '@testing-library/react';

// override render method
export { render };
