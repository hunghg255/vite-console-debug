import styles from './App1.module.css';

function App() {
  console.log({
    a: 1,
  });

  const onA = () => {
    console.log('3');
  };

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>A</h1>
      <button
        onClick={() => {
          console.log('2');
          onA();
        }}
      >
        Click
      </button>
    </div>
  );
}

export default App;
