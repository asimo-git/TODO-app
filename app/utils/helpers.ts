import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  QuerySnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { SavedTask, Task } from "./interfaces";
import { Entry } from "./constatnts";

export async function saveNewTask({
  uid,
  type,
  data,
}: {
  uid: string;
  type: string;
  data: Task;
}) {
  try {
    await addDoc(collection(db, `users/${uid}/tasks`), {
      type,
      ...data,
    });
    console.log(data);
    return true;
  } catch (error) {
    console.error("Error while saving task:", error);
    return false;
  }
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
    console.error("Error while getting tasks:", error);
  }
}

export async function deleteTask(uid: string, taskId: string) {
  try {
    const taskRef = doc(db, `users/${uid}/tasks`, taskId);
    await deleteDoc(taskRef);

    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    return false;
  }
}

export async function updateTask({
  uid,
  taskId,
  updatedData,
}: {
  uid: string;
  taskId: string;
  updatedData: Partial<Task>;
}) {
  try {
    const taskRef = doc(db, `users/${uid}/tasks`, taskId);
    await updateDoc(taskRef, updatedData);

    console.log("Задача успешно обновлена");
    return true;
  } catch (error) {
    console.error("Ошибка при обновлении задачи:", error);
    return false;
  }
}
