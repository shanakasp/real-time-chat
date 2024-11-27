import { useState } from "react";
import "./App.css";
import RealtimeChat from "./components/RealtimeChat";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <RealtimeChat />
    </>
  );
}

export default App;
