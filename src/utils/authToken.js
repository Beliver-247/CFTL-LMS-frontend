import { auth } from '../firebase';

export const getFreshToken = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      unsubscribe(); // Prevent memory leaks
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
