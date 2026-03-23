import { UserList } from "./components/UserList";

function App() {
  return (
    <div className="app">
      <h1>Flag Pattern (Bad)</h1>
      <p className="subtitle">
        Multiple boolean flags — 2^n possible state combinations
      </p>
      <UserList />
    </div>
  );
}

export default App;
