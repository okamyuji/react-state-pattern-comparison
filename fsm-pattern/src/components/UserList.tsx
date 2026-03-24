import { useUsers } from "../hooks/useUsers";

export function UserList() {
  const { state, availableEvents, fetchUsers, retry } = useUsers();

  // GOOD: Render based on single discriminated status — exhaustive, no impossible states
  const renderContent = () => {
    switch (state.status) {
      case "idle":
        return <p>Click the button to fetch users.</p>;
      case "loading":
        return <p>Loading...</p>;
      case "success":
        return (
          <>
            <ul>
              {state.data.map((user) => (
                <li key={user.id}>
                  {user.name} ({user.email}) - {user.department}
                </li>
              ))}
            </ul>
            <p className="meta">
              Fetched at: {state.fetchedAt.toLocaleTimeString()}
            </p>
          </>
        );
      case "error":
        return <p className="error">Error: {state.error.message}</p>;
    }
  };

  return (
    <div className="state-view">
      <p className="status">
        Status: <strong>{state.status}</strong>
      </p>
      {renderContent()}
      <div className="actions">
        {/* Buttons driven by availableEvents — auto-derived from transition table */}
        {availableEvents.includes("FETCH") && (
          <button onClick={fetchUsers}>
            {state.status === "success" ? "Re-fetch" : "Fetch Users"}
          </button>
        )}
        {availableEvents.includes("RETRY") && (
          <button onClick={retry}>Retry</button>
        )}
      </div>
      <p className="debug">available events: [{availableEvents.join(", ")}]</p>
    </div>
  );
}
