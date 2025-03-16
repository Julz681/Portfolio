import { db } from "./firebase.js";  // Import Firestore database connection
import { collection, addDoc } from "firebase/firestore";  // Import Firestore functions for adding documents

// Example task data (replace this with real data from the UI)
const tasks = [
  {
    title: "Design the Homepage",  // Task title
    description: "Create a wireframe for the main landing page.",  // Task description
    dueDate: "2025-03-20",  // Due date for task completion
    priority: "urgent",  // Priority level (options: "urgent", "medium", "low")
    assignedTo: ["Ada Lovelace", "Claude Shannon"],  // Assigned team members
    category: "Design",  // Task category
    subtasks: [
      { name: "Create wireframe", done: false },  // Subtask 1 (not completed)
      { name: "Review with team", done: false }   // Subtask 2 (not completed)
    ]
  },
  {
    title: "Implement Login System",
    description: "Develop authentication using Firebase Auth.",
    dueDate: "2025-03-25",
    priority: "medium",
    assignedTo: ["Dennis Ritchie"],
    category: "Development",
    subtasks: [
      { name: "Setup Firebase Auth", done: false },
      { name: "Create UI for login", done: false }
    ]
  }
];

// Function to upload tasks to Firestore
async function uploadTasks() {
  try {
    // Loop through all tasks and add them to Firestore
    for (const task of tasks) {
      await addDoc(collection(db, "tasks"), task);  // Add task to Firestore "tasks" collection
    }
  } catch (error) {
    // Handle errors if the upload fails
    console.error("Error uploading tasks:", error);
  }
}

// Start the upload process
uploadTasks();
