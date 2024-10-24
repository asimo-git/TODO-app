import { addDoc, collection, getDocs, QuerySnapshot } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { SavedTask, Task } from "./interfaces";
import { Entry } from "./constatnts";

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

export async function getTasksFromFireStore(uid: string = "") {
  try {
    const tasksSnapshot: QuerySnapshot = await getDocs(
      collection(db, `users/${uid}/tasks`)
    );

    const tasks: Record<Entry, SavedTask[]> = {
      [Entry.task]: [],
      [Entry.heap]: [],
      [Entry.habit]: [],
    };

    tasksSnapshot.forEach((doc) => {
      const task = doc.data() as SavedTask;
      task.id = doc.id;

      tasks[task.type as Entry].push(task);
    });

    return tasks;
  } catch (error) {
    console.error("Ошибка при получении задач:", error);
  }
}
