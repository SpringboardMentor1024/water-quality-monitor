import AdminProfile from "./AdminProfile";
import NGOProfile from "./NGOProfile";
import UserProfile from "./UserProfile";

export default function Profile() {
  const role = localStorage.getItem("role"); // admin | ngo | user

  if (role === "admin") return <AdminProfile />;
  if (role === "ngo") return <NGOProfile />;
  if (role === "user") return <UserProfile />;

  return <p>Invalid role</p>;
}
