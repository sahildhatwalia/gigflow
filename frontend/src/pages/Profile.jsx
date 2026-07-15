import { useEffect, useState } from "react";
import profileApi from "../api/profile";
import toast from "react-hot-toast";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await profileApi.getProfile();
      setUser(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load profile");
    }
  };

  if (!user) {
    return <h1 className="text-center mt-20">Loading...</h1>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-xl shadow">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="space-y-4">
        <p>
          <strong>Name:</strong> {user.name}
        </p>

        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <p>
          <strong>Phone:</strong> {user.phone || "-"}
        </p>

        <p>
          <strong>Bio:</strong> {user.bio || "-"}
        </p>

        <p>
          <strong>Address:</strong> {user.address || "-"}
        </p>

        <p>
          <strong>Github:</strong> {user.github || "-"}
        </p>

        <p>
          <strong>LinkedIn:</strong> {user.linkedin || "-"}
        </p>

        <p>
          <strong>Website:</strong> {user.website || "-"}
        </p>
      </div>
    </div>
  );
}

export default Profile;