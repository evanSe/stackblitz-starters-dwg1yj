import Dexie from 'dexie';
import { initData } from './initData';

// Define the data type
export type Data = {
  task_id: string;
  task_name: string;
  long_description: string;
  creation_date: string;
  team: string;
  progress: number;
  assignee: string;
  estimated_hours: number;
  average_rate: number;
  status: string;
};

class TaskDatabase extends Dexie {
  tasks: Dexie.Table<Data, string>;

  constructor() {
    super("TaskDatabase");
    this.version(1).stores({
      tasks: "task_id, task_name, status" // Index fields we want to query often
    });
    this.tasks = this.table("tasks");
  }
}

// Initialize the database
let db: TaskDatabase | null = null;

export function getDatabase() {
  if (!db) {
    db = new TaskDatabase();
  }
  return db;
}


// Upsert function to update or insert a task
export async function upsertTask(taskId: string, prop: keyof Data, newVal: any) {
  const existingTask = await getDatabase().tasks.get(taskId);

  if (existingTask) {
    // @ts-ignore 
    existingTask[prop] = newVal;
    await getDatabase().tasks.put(existingTask);
  } else {
    const newTask: Data = {
      task_id: taskId,
      task_name: "",
      long_description: "",
      creation_date: "",
      team: "",
      progress: 0,
      assignee: "",
      estimated_hours: 0,
      average_rate: 0,
      status: "",
      [prop]: newVal,
    };
    await getDatabase().tasks.put(newTask);
  }
}

// Function to get all tasks
export async function getAllTasks(): Promise<Data[]> {
  return await getDatabase().tasks.toArray();
}

// Initialize the database with initial data if empty
export async function initializeDatabase() {
  const db = getDatabase();

  const taskCount = await db.tasks.count();
  if (taskCount === 0) {
    const initialData: Data[] = initData;

    await db.tasks.bulkPut(initialData);
    console.log('Database initialized with initial data.');
  }
}

