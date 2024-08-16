import { useState, useEffect } from "react";
import { getAllTasks, initializeDatabase } from "@/utils/dexie";

export function useTasks() {
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // Initialize the database if it's empty
      await initializeDatabase();

      // Fetch all tasks from the database
      const tasks = await getAllTasks();
      setAllTasks(tasks);

      // Set loading to false after data is fetched
      setIsLoading(false);
    }

    loadData();
  }, []);

  return { allTasks, isLoading };
}
