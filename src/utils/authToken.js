import { auth } from '../firebase';

export const getFreshToken = () => {
  return new Promise(async (resolve, reject) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken(true);
        return resolve(token);
      } catch (err) {
        return reject(err);
      }
    }

    // fallback: wait for user to be available
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      unsubscribe();
      if (!user) return reject(new Error("Not authenticated"));
      try {
        const token = await user.getIdToken(true);
        resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  });
};
