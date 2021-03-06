/* @flow */
import * as storageUtils from 'utils/storage';

import type { State as SendFormState } from 'reducers/SendFormReducer';
import type {
    ThunkAction,
    PayloadAction,
    GetState,
    Dispatch,
} from 'flowtype';

const TYPE: 'session' = 'session';
const { STORAGE_PATH } = storageUtils;
const KEY_TX_DRAFT: string = `${STORAGE_PATH}txdraft`;

const getTxDraftKey = (getState: GetState): string => {
    const { pathname } = getState().router.location;
    return `${KEY_TX_DRAFT}${pathname}`;
};

export const saveDraftTransaction = (): ThunkAction => (dispatch: Dispatch, getState: GetState): void => {
    const state = getState().sendForm;
    if (state.untouched) return;

    const key = getTxDraftKey(getState);
    storageUtils.set(TYPE, key, JSON.stringify(state));
};

export const loadDraftTransaction = (): PayloadAction<?SendFormState> => (dispatch: Dispatch, getState: GetState): ?SendFormState => {
    const key = getTxDraftKey(getState);
    const value: ?string = storageUtils.get(TYPE, key);
    if (!value) return null;
    const state: ?SendFormState = JSON.parse(value);
    if (!state) return null;
    // decide if draft is valid and should be returned
    // ignore this draft if has any error
    if (Object.keys(state.errors).length > 0) {
        storageUtils.remove(TYPE, key);
        return null;
    }
    return state;
};

export const clear = (): ThunkAction => (dispatch: Dispatch, getState: GetState): void => {
    const key = getTxDraftKey(getState);
    storageUtils.remove(TYPE, key);
};
