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
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { SavedTask, Task } from "../utils/interfaces";
import { Entry, FirestoreSection } from "../utils/constatnts";
import {
  isTodayMatchingInterval,
  isTodayMatchingWeekDays,
} from "../utils/helpers";

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
  const path =
    "completedDate" in data && data.completedDate
      ? `users/${uid}/completed`
      : `users/${uid}/tasks`;
  if ("id" in data) {
    await setDoc(doc(db, path, data.id), data);
  } else {
    await addDoc(collection(db, path), data);
  }
}

export async function getTasksFromFireStore(
  uid: string = "",
  section: FirestoreSection
) {
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

export async function completeTask({
  uid,
  data,
}: {
  uid: string;
  data: SavedTask;
}) {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  const doneTask = { ...data, completedDate: formattedDate };

  await saveNewTask({
    uid,
    data: doneTask,
  });
  await deleteTask({ uid, taskId: data.id, typeTask: "todo" });
}

export async function undoTask({
  uid,
  data,
}: {
  uid: string;
  data: SavedTask;
}) {
  // eslint-disable-next-line
  const { completedDate, ...newTask } = data;

  await saveNewTask({
    uid,
    data: newTask,
  });
  await deleteTask({ uid, taskId: data.id, typeTask: "done" });
}

export async function getTodayTasks(uid: string) {
  const [tasks, doneTasks] = await Promise.all([
    getTasksFromFireStore(uid, "tasks"),
    getTasksFromFireStore(uid, "completed"),
  ]);
  if (!tasks && !doneTasks) return null;

  const currentStrDate = new Date().toISOString().split("T")[0];
  const currentDate = new Date();

  if (tasks) {
    tasks[Entry.task] = tasks[Entry.task].filter(
      (task) => task.date === currentStrDate
    );

    tasks[Entry.heap] = tasks[Entry.heap].filter(
      (task) => new Date(task.date) >= currentDate
    );

    if (doneTasks) {
      tasks[Entry.task] = [
        ...tasks[Entry.task],
        ...doneTasks[Entry.task].filter((task) => task.date === currentStrDate),
      ];

      tasks[Entry.heap] = [
        ...tasks[Entry.heap],
        ...doneTasks[Entry.heap].filter(
          (task) => task.completedDate === currentStrDate
        ),
      ];
    }

    tasks[Entry.habit] = tasks[Entry.habit].filter((task) => {
      if (new Date(task.date) <= currentDate && task.frequency) {
        if (task.frequency === "daily") return true;

        if (task.frequency.startsWith("interval")) {
          return (
            task.date === currentStrDate ||
            isTodayMatchingInterval(task.date, +task.frequency.split("-")[1])
          );
        }

        if (task.frequency.startsWith("daysPerWeek")) {
          const targetCounter = task.frequency.split("-")[1];
          return (
            !task.completedCounter || +task.completedCounter < +targetCounter
          );
        }

        return isTodayMatchingWeekDays(task.frequency.split(","));
      }
    });
  }

  return tasks;
}

export async function handleCheckChange({
  uid,
  task,
  checked,
}: {
  uid: string;
  task: SavedTask;
  checked: boolean;
}) {
  const { completedCounter = [] } = task;
  const currentStrDate = new Date().toISOString().split("T")[0];
  const updatedCompletedCounter = checked
    ? [...completedCounter, currentStrDate]
    : completedCounter.filter((item) => item !== currentStrDate);

  let statusChanged: boolean = false;

  if (task.type === Entry.heap) {
    statusChanged = await checkHeapStatus({
      uid,
      task: { ...task, completedCounter: updatedCompletedCounter },
      checked,
    });
  }

  if (!statusChanged) {
    await updateTask({
      uid,
      updatedData: { ...task, completedCounter: updatedCompletedCounter },
      typeTask: "todo",
    });
  }
}

export async function checkHeapStatus({
  uid,
  task,
  checked,
}: {
  uid: string;
  task: SavedTask;
  checked: boolean;
}) {
  const { completedCounter, repetition = 1 } = task;
  const completedNumber = completedCounter?.length || 0;

  if (checked && +repetition === completedNumber) {
    await completeTask({ uid, data: task });
    return true;
  }

  if (!checked && +repetition === completedNumber + 1) {
    await undoTask({ uid, data: task });
    return true;
  }

  return false;
}
