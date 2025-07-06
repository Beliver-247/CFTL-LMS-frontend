import { auth } from "../firebase";

export const getFreshToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  return await user.getIdToken();
};
