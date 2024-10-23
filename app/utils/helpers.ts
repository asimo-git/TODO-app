import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { Task } from "./interfaces";

export async function saveNewTask({
  type,
  data,
}: {
  type: string;
  data: Task;
}) {
  const currentUser = auth.currentUser;

  if (currentUser) {
    const { uid } = currentUser;

    try {
      await addDoc(collection(db, `users/${uid}/tasks`), {
        uid: uid,
        type,
        ...data,
      });

      return true;
    } catch {
      return false;
    }
  }
  return false;
}
