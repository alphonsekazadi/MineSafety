import { getWizardDataFromDataRows } from './chart-wizard/get-wizard-data-from-data-rows';
import { ActionTypes, createInitialState, createState, fontNames, fontSizes, isCategorical, mergeStates, parseFont, updateState } from './chart-wizard/state';
import {
    messages
} from './chart-wizard/messages';

export const ChartWizardCommon = Object.freeze({
    getWizardDataFromDataRows,
    ActionTypes,
    createInitialState,
    createState,
    fontNames,
    fontSizes,
    isCategorical,
    mergeStates,
    parseFont,
    updateState,
    messages
});
