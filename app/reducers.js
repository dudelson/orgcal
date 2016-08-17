/**
 * Redux reducer definitions
 * see http://redux.js.org/docs/basics/Reducers.html
 */

import * as Actions from './actions';

/* ALL FUNCTIONS DEFINED IN THIS FILE MUST BE PURE FUNCTIONS */

export function tasks(state={ byId: {}, byDate: {} }, action) {
    if (action.type === Actions.ADD_TASK) {
        let newId = {};
        newId[action.task.id] = action.task;
        let byId = Object.assign({}, state.tasks.byId, newId);

        let tasksForDate;
        if (state.tasks.byDate.hasOwnProperty(action.task.date)) {
            tasksForDate = [...state.tasks.byDate[action.task.date], action.task.id];
        } else {
            tasksForDate = [action.task.id];
        }
        let newDate = {};
        newDate[action.task.date] = tasksForDate;
        let byDate = Object.assign({}, state.tasks.byDate, newDate);

        return Object.assign({}, state, {
            tasks: {
                byId,
                byDate,
            },
        });
    }

    return state;
}

export function taskOverlay(state={ isVisible: false }, action) {
    if (action.type === Actions.TOGGLE_TASK_OVERLAY) {
        return Object.assign({}, state, {
            taskOverlay: {
                isVisible: action.setVisible,
                currentTask: action.currentTask,
            },
        });
    }

    return state;
}
