import { useUsers } from "../hooks/useUsers";

export function UserList() {
  const { isLoading, isError, hasData, data, error, fetchUsers, retry } =
    useUsers();

  // BAD: Priority-based conditional chain — impossible to tell which state is "active"
  if (isLoading) {
    return (
      <div className="state-view">
        <p>Loading...</p>
        <p className="debug">
          flags: isLoading={String(isLoading)}, isError={String(isError)},
          hasData={String(hasData)}
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="state-view">
        <p className="error">Error: {error?.message}</p>
        <button onClick={retry}>Retry</button>
        <p className="debug">
          flags: isLoading={String(isLoading)}, isError={String(isError)},
          hasData={String(hasData)}
        </p>
      </div>
    );
  }

  if (hasData) {
    return (
      <div className="state-view">
        <ul>
          {data.map((user) => (
            <li key={user.id}>
              {user.name} ({user.email}) - {user.department}
            </li>
          ))}
        </ul>
        <button onClick={fetchUsers}>Re-fetch</button>
        <p className="debug">
          flags: isLoading={String(isLoading)}, isError={String(isError)},
          hasData={String(hasData)}
        </p>
      </div>
    );
  }

  return (
    <div className="state-view">
      <p>Click the button to fetch users.</p>
      <button onClick={fetchUsers}>Fetch Users</button>
      <p className="debug">
        flags: isLoading={String(isLoading)}, isError={String(isError)},
        hasData={String(hasData)}
      </p>
    </div>
  );
}
