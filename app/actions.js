/**
 * Redux action definitions
 * see http://redux.js.org/docs/basics/Actions.html
 */

import { dispatch } from 'redux';

export const ADD_TASK = 'ADD_TASK';
export const TOGGLE_TASK_OVERLAY = 'TOGGLE_TASK_OVERLAY';

/**
 * Action creator which adds a task to the redux store
 * @param {ScheduledTask} taskObj the task to add
 */
function addTask(taskObj) {
    return {
        type: ADD_TASK,
        task: taskObj,
    };
}

/**
 * Toggles the visibility of the task overlay. If <setVisible> is true,
 * the info for <currentTask> will be shown.
 * @param {Boolean} setVisible set the task overlay to be visible?
 * @param {Number} currentTask the info to display in the overlay. Only applies if <setVisible> is true.
 */
function toggleTaskOverlay(setVisible, currentTask) {
    return {
        type: TOGGLE_TASK_OVERLAY,
        setVisible,
        currentTask,
    };
}

export const addTask = (taskObj) => dispatch(addTask(taskObj));
export const toggleTaskOverlay = (setVisible, currentTask) =>
          dispatch(toggleTaskOverlay(setVisible, currentTask));
