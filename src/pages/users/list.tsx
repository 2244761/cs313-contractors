import { useList } from "@refinedev/core";

export const UserList: React.FC = () => {
  const { query, result } = useList({
    resource: "user",
  });

  const users = result.data ?? [];

  if (query.isLoading) return <div>Loading List...</div>;
  if (query.isError) return <div>Oh no! Something went wrong! </div>;

  return (
    <div className="bg-white rounded-lg p-6">
      <table className="w-full text-center">
        <thead>
          <tr>
            <th>ID</th>
            <th>Student Number</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr className="border-b border-[var(--ui-border)]">
              <td className="py-2 ">{user.id}</td>
              <td className="py-2">{user.student_id ?? "Not Applicable"}</td>
              <td className="py-2">{user.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
