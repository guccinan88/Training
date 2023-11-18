import logo from "./logo.svg";
import "./App.css";
import Sparkle from "./Sparkle";

function App() {
  const name = "nan";
  const now = new Date().toLocaleDateString();
  return (
    <div className="App">
      <p>Hello World:{name}</p>
      <p>Time:{now}</p>
      <Sparkle />
    </div>
  );
}

export default App;
