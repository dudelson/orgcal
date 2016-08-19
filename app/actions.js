/**
 * Redux action definitions
 * see http://redux.js.org/docs/basics/Actions.html
 */

export const ADD_TASK = 'ADD_TASK';
export const TOGGLE_TASK_OVERLAY = 'TOGGLE_TASK_OVERLAY';
export const SET_DISPLAYED_WEEK = 'SET_DISPLAYED_WEEK';

/**
 * Action creator which adds a task to the redux store
 * @param {ScheduledTask} taskObj the task to add
 */
export function addTask(taskObj) {
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
export function toggleTaskOverlay(setVisible, currentTask) {
    return {
        type: TOGGLE_TASK_OVERLAY,
        setVisible,
        currentTask,
    };
}

/**
 * Sets the week displayed in the week view to <week>. <week> should be of the
 * format returned by DateTime.weekRelative().
 * @param {Array} week the week to display
 */
export function setDisplayedWeek(week) {
    return {
        type: SET_DISPLAYED_WEEK,
        week,
    };
}
