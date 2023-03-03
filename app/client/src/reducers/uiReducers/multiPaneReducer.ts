import { createImmerReducer } from "utils/ReducerUtils";
import {
  ReduxAction,
  ReduxActionTypes,
} from "@appsmith/constants/ReduxActionConstants";

export const TABS_PANE_MIN_WIDTH = 390;

export enum PaneLayoutOptions {
  ONE_PANE = 1,
  TWO_PANE = 2,
  THREE_PANE = 3,
}

export enum SideNavMode {
  Explorer = 1,
  Libraries,
  DataSources,
}

const initialState: MultiPaneReduxState = {
  tabsPaneWidth: TABS_PANE_MIN_WIDTH,
  paneCount: PaneLayoutOptions.THREE_PANE,
};

const multiPaneReducer = createImmerReducer(initialState, {
  [ReduxActionTypes.SET_TABS_PANE_WIDTH]: (
    state: MultiPaneReduxState,
    action: ReduxAction<{ width: number }>,
  ) => {
    state.tabsPaneWidth = action.payload.width;
  },
  [ReduxActionTypes.SET_PANE_COUNT]: (
    state: MultiPaneReduxState,
    action: ReduxAction<{ count: PaneLayoutOptions }>,
  ) => {
    state.paneCount = action.payload.count;
  },
  [ReduxActionTypes.SIDE_NAV_MODE]: (
    state: MultiPaneReduxState,
    action: ReduxAction<SideNavMode | undefined>,
  ) => {
    state.sideNavMode = action.payload;
  },
});

export interface MultiPaneReduxState {
  tabsPaneWidth: number;
  paneCount: PaneLayoutOptions;
  sideNavMode?: SideNavMode;
}

export default multiPaneReducer;
