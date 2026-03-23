import { UserList } from "./components/UserList";

function App() {
  return (
    <div className="app">
      <h1>FSM Pattern (Good)</h1>
      <p className="subtitle">
        Table-driven Finite State Machine — impossible states are impossible
      </p>
      <UserList />
    </div>
  );
}

export default App;
