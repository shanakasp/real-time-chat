import { useState } from "react";
import "./App.css";
import RealtimeChat from "./components/RealtimeChat";
import RestartSession from "./components/RestartSession";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <RealtimeChat />
      <RestartSession />
    </>
  );
}

export default App;
