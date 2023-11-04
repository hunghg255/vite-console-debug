import styles from './App1.module.css';

function App() {
  console.log('App1'); // aaa
  console.log({
    a: 1,
    b: 2,
  });

  console.log(
    JSON.stringify({
      a: 1,
      b: 2,
    }),
  );

  console.warn('App1');
  console.error('App1');

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>A</h1>
    </div>
  );
}

export default App;
