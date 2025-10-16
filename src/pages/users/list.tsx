import { useList } from "@refinedev/core";

export const UserList: React.FC = () => {
  const { query, result } = useList({
    resource: "users",
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
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Student Number</th>
            {/* <th>Banned</th> */}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr className="border-b border-[var(--ui-border)]">
              <td className="py-2 ">{user.id}</td>
              <td className="py-2">{user.full_name}</td>
              <td className="py-2">{user.email}</td>
              <td className="py-2">{user.role}</td>
              <td className="py-2">{user.student_id ?? "Not Applicable"}</td>
              {/* <td>{user.is_banned}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
      {/* <ul className="flex flex-col gap-5"></ul> */}
    </div>
  );
};
