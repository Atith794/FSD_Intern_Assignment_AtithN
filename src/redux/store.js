import { createStore } from 'redux';

// Initial state
const initialState = {
  tasks: []
};

// Action types
const ADD_TASK = 'ADD_TASK';
const COMPLETE_TASK = 'COMPLETE_TASK';

// Reducer function
function taskReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      };
    case COMPLETE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload ? { ...task, completed: true } : task
        )
      };
    default:
      return state;
  }
}

// Create Redux store
const store = createStore(taskReducer);

export default store;
