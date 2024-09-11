// Action types
export const ADD_TASK = 'ADD_TASK';
export const COMPLETE_TASK = 'COMPLETE_TASK';

// Action creators
export const addTask = (task) => ({
  type: ADD_TASK,
  payload: task
});

export const completeTask = (taskId) => ({
  type: COMPLETE_TASK,
  payload: taskId
});
