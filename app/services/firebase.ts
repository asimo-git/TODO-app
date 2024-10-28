import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  QuerySnapshot,
  updateDoc,
} from "firebase/firestore";
import { SavedTask, Task } from "../utils/interfaces";
import { Entry } from "../utils/constatnts";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);

export async function saveNewTask({
  uid,
  data,
}: {
  uid: string;
  data: Task | SavedTask;
}) {
  let path: string;
  if ("completedDate" in data && data.completedDate) {
    path = `users/${uid}/completed`;
  } else {
    path = `users/${uid}/tasks`;
  }
  await addDoc(collection(db, path), data);
}

export async function getTasksFromFireStore(uid: string = "", section: string) {
  try {
    const tasksSnapshot: QuerySnapshot = await getDocs(
      collection(db, `users/${uid}/${section}`)
    );

    if (tasksSnapshot.empty) {
      return null;
    }

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

interface DeleteTaskParams {
  uid: string;
  taskId: string;
  typeTask: string;
}

export async function deleteTask({ uid, taskId, typeTask }: DeleteTaskParams) {
  const path = typeTask === "done" ? "completed" : "tasks";
  const taskRef = doc(db, `users/${uid}/${path}`, taskId);
  await deleteDoc(taskRef);
}

interface UpdateTaskParams {
  uid: string;
  updatedData: SavedTask;
  typeTask: string;
}

export async function updateTask({
  uid,
  updatedData,
  typeTask,
}: UpdateTaskParams) {
  const path = typeTask === "done" ? "completed" : "tasks";
  const taskRef = doc(db, `users/${uid}/${path}`, updatedData.id);
  // eslint-disable-next-line
  const { id, type, ...fieldsToUpdate } = updatedData;
  await updateDoc(taskRef, fieldsToUpdate);
}
