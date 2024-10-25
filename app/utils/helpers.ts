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
  data,
}: {
  uid: string;
  data: Task | SavedTask;
}) {
  try {
    let path: string;
    if ("completedDate" in data && data.completedDate) {
      path = `users/${uid}/completed`;
    } else {
      path = `users/${uid}/tasks`;
    }
    await addDoc(collection(db, path), data);
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
  updatedData,
}: {
  uid: string;
  updatedData: SavedTask;
}) {
  try {
    console.log(updatedData);
    const taskRef = doc(db, `users/${uid}/tasks`, updatedData.id);
    // eslint-disable-next-line
    const { id, type, ...fieldsToUpdate } = updatedData;
    await updateDoc(taskRef, fieldsToUpdate);

    console.log("Задача успешно обновлена");
    return true;
  } catch (error) {
    console.error("Ошибка при обновлении задачи:", error);
    return false;
  }
}
