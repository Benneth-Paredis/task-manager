import { useEffect } from 'react';
import { useAppDispatch } from './store/hooks';
import { setTasks } from './store/tasksSlice';
import Board from './components/Board';

const STORAGE_KEY = 'task-manager-tasks';

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        dispatch(setTasks(JSON.parse(e.newValue)));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [dispatch]);
  return (
    <div className="app">
      <div className="blob" style={{ background: 'rgba(232, 121, 249, 0.32)', top: '-150px', left: '-100px' }} />
      <div className="blob" style={{ background: 'rgba(99, 179, 237, 0.25)', bottom: '-200px', right: '-100px' }} />
      <div className="blob" style={{ background: 'rgba(167, 139, 250, 0.2)', top: '30%', left: '40%' }} />
      <h1>Task Manager</h1>
      <Board />
    </div>
  );
};

export default App;
