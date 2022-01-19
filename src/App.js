import * as React from "react";
// import logo from "./logo.svg";
import "./App.css";

function App() {
  const [num, setNum] = React.useState(0);
  React.useLayoutEffect(() => {
    if (num === 0) {
      setNum(1);
    }
  }, [num]);
  return (
    <div className="App">
      <header className="App-header" onClick={() => setNum(num + 1)}>
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h1>{num}</h1>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
export default App;
