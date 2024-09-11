import React from 'react';
import { Provider } from 'react-redux';
import TaskList from './components/TaskList';
import store from './redux/store';

function App() {
  return (
    <Provider store={store}>
      <TaskList />
    </Provider>
  );
}

export default App;
