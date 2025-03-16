import { db } from "../firebase/firebase.js";  // Import Firestore database connection
import { collection, addDoc } from "firebase/firestore";  // Import Firestore functions for adding documents

// Array containing all contact objects
const contacts = [
  { name: "Ada Lovelace", email: "ada.lovelace@gmail.com", phone: "+49 111 111 11 11", avatar: "AL", group: "A" },
  { name: "Bernadette Pöltl", email: "bernadette.poeltl99@gmail.com", phone: "+43 650 88 00 963", avatar: "BP", group: "B" },
  { name: "Claude Shannon", email: "claude.shannon@gmail.com", phone: "+49 333 333 33 33", avatar: "CS", group: "C" },
  { name: "Dennis Ritchie", email: "dennis.ritchie@gmail.com", phone: "+49 444 444 44 44", avatar: "DR", group: "D" },
  { name: "Edsger Dijkstra", email: "edsger.dijkstra@gmail.com", phone: "+49 555 555 55 55", avatar: "ED", group: "E" },
  { name: "Frances Allen", email: "frances.allen@gmail.com", phone: "+49 666 666 66 66", avatar: "FA", group: "F" },
  { name: "Judith Lütke", email: "judithlachtrup@yahoo.de", phone: "+49 777 777 77 77", avatar: "JL", group: "J" },
  { name: "Margaret Hamilton", email: "margaret.hamilton@gmail.com", phone: "+49 888 888 88 88", avatar: "MH", group: "M" },
  { name: "Reshma Saujani", email: "reshma.saujani@gmail.com", phone: "+49 999 999 99 99", avatar: "RS", group: "R" },
  { name: "Shafi Goldwasser", email: "shafi.goldwasser@gmail.com", phone: "+49 101 101 10 10", avatar: "SG", group: "S" },
  { name: "Tobias Fröhler", email: "tobias.froehler24@gmail.com", phone: "+49 202 202 20 20", avatar: "TF", group: "T" }
];

// Function to upload contacts to Firestore
async function uploadContacts() {
  try {
    // Loop through each contact in the array
    for (const contact of contacts) {
      await addDoc(collection(db, "contacts"), contact);  // Add each contact to the "contacts" collection in Firestore
    }
  } catch (error) {
    // Handle errors if the upload fails
    console.error("Error uploading contacts:", error);
  }
}

// Start the upload process
uploadContacts();
