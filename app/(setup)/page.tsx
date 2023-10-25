import { initialProfile } from "@/lib/initial-profile";

const SetupPage = async () => {
  const profile = await initialProfile();

  return (
    <div>
      <h1>{profile.name}</h1>
    </div>
  );
};

export default SetupPage;
