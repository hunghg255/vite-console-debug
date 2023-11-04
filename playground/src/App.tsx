import styles from './App.module.css';
import App1 from './App1';

function App() {
  return (
    <div className={styles.app}>
      <h1 className={styles.title}>A</h1>

      <App1 />
    </div>
  );
}

export default App;
