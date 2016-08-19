/**
 * Redux reducer definitions
 * see http://redux.js.org/docs/basics/Reducers.html
 */

import * as Actions from './actions';

/* ALL FUNCTIONS DEFINED IN THIS FILE MUST BE PURE FUNCTIONS */

export function tasks(state={ byId: {}, byDate: {} }, action) {
    /* helper functions */

    /**
     * Given two task ids, returns a boolean indicating whether the tasks
     * overlap.
     * NOTE: I'm like 90% sure this function is pure, but I don't know the
     * internals of moment.js, so IT MIGHT NOT BE.
     * @param {Number} A the ID of the first task
     * @param {Number} B the ID of the second task
     * @returns {Boolean} whether tasks A and B overlap
     */
    function isOverlapping(A, B) {
        let mA = state.tasks.byId[A];
        let mB = state.tasks.byId[B];

        return (mA.startTimestamp.isBetween(mB.startTimestamp, mB.endTimestamp)) ||
               (mB.startTimestamp.isBetween(mA.startTimestamp, mA.endTimestamp));
    }

    /**
     * Given a task ID, computes the "connected component" that includes the task,
     * i.e. a list of all the tasks which overlap with this task, either directly
     * or indirectly (an example of indirect overlapping is where task A is from
     * 12PM to 2PM, task B is from 1PM to 3PM, and task C is from 2:30PM to 4PM.
     * Thus A and C do not overlap with each other (directly), but the existence
     * of C must still be taken into account when computing the overlap slot for
     * A). If the tasks managed by orgcal are viewed as an unweighted, undirected
     * graph where tasks are nodes and directly overlapping tasks are connected
     * by an edge, this calculation reduces to simply finding the connected
     * component for <taskId>, thus the name.
     * @param {Number} taskId the task to find the connected component for
     * @returns {Array} the connected component for <taskId>; i.e. all tasks that
     * overlap either directly or indirectly with <taskId>.
     */
    function findConnectedComponent(taskId) {
        let mutuallyOverlapping = [];
        let q = [taskId];
        while (q.length !== 0) {
            let task = q.pop();
            if (mutuallyOverlapping.includes(task)) continue;
            mutuallyOverlapping.push(task);
            state.tasks.byId[task].overlaps.forEach((t) => {
                // Add to the end of the queue
                // why is this method called "unshift"?
                q.unshift(t);
            });
        }
        return mutuallyOverlapping;
    }

    /* reducer logic */

    if (action.type === Actions.ADD_TASK) {
        let newId = {};
        newId[action.task.id] = action.task;
        // compute overlaps for new task
        newId[action.task.id].overlaps = state.tasks.byDate[action.task.startDate]
            .filter((otherTask) => isOverlapping(action.task, otherTask));
        // add this task to the overlap list of every task with which it overlaps
        newId[action.task.id].overlaps.forEach((taskId) => {
            let overlaps = [...state.tasks.byId[taskId].overlaps, action.task.id];
            newId[taskId] = Object.assign({}, state.tasks.byId[taskId], { overlaps });
        });
        // update overlapSlot for every task in the connected component
        let connectedComponent = findConnectedComponent(action.task.id);
        connectedComponent.forEach((taskId, i) => {
            newId[taskId] = Object.assign({}, state.tasks.byId[taskId], { overlapSlot: i });
        });

        // update byId object
        let byId = Object.assign({}, state.tasks.byId, newId);

        // update byDate object
        let tasksForDate;
        if (state.tasks.byDate.hasOwnProperty(action.task.startDate)) {
            tasksForDate = [...state.tasks.byDate[action.task.startDate], action.task.id];
        } else {
            tasksForDate = [action.task.id];
        }
        let newDate = {};
        newDate[action.task.startDate] = tasksForDate;
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

export function displayedWeek(state=[], action) {
    if (action.type === Actions.SET_DISPLAYED_WEEK) {
        return action.week;
    }

    return state;
}
