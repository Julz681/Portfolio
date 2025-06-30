// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, set, get, push, remove, update, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDgNtGowYZqJ1vABCb_q-VcivCrOEHXDy4",
    authDomain: "joinneu-f519c.firebaseapp.com",
    databaseURL: "https://joinneu-f519c-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "joinneu-f519c",
    storageBucket: "joinneu-f519c.appspot.com",
    messagingSenderId: "898748577212",
    appId: "1:898748577212:web:eef88751e72a00e8ece7b9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Export firebase references and functions
export { database, ref, push, set, get, remove, update, onValue };

/**
 * Save user data to Firebase Realtime Database
 * @param {string} userId - Unique user ID
 * @param {string} name - User's name
 * @param {string} email - User's email
 */
export function saveUserData(userId, name, email, password) {
    set(ref(database, 'users/' + userId), {
        name: name,
        email: email,
        password: password
    });
}

/**
 * Retrieves user data from Firebase Realtime Database based on email.
 * @param {string} email - The user's email address.
 * @returns {Promise<object | null>} - A promise that resolves with the user data or null.
 */
export async function getUserDataByEmail(email) {
    const usersRef = ref(database, 'users');
    try {
        const snapshot = await get(usersRef);
        return snapshot.exists()
            ? findUserByEmail(snapshot, email)
            : null;
    } catch (error) {
        handleUserFetchError(error);
        return null;
    }
}

/**
 * Iterates through the snapshot to find a user with the given email.
 * @param {DataSnapshot} snapshot - Firebase snapshot of the 'users' node.
 * @param {string} email - The email to search for.
 * @returns {object | null} - The user object with userId or null if not found.
 */
function findUserByEmail(snapshot, email) {
    let userData = null;
    snapshot.forEach(childSnapshot => {
        const user = childSnapshot.val();
        if (user.email === email) {
            userData = { ...user, userId: childSnapshot.key };
            return true;
        }
    });
    return userData;
}


/**
 * Saves a contact for a specific user in Firebase Realtime Database.
 * @param {string} userId - The user's ID.
 * @param {string} name - The contact's name.
 * @param {string} email - The contact's email.
 * @param {string} phone - The contact's phone number.
 */
export function saveContact(userId, name, email, phone) {
    const contactsRef = ref(database, `users/${userId}/contacts`);
    const newContactRef = push(contactsRef);
    set(newContactRef, {
        name: name,
        email: email,
        phone: phone
    });
}

/**
 * Retrieves all contacts for a specific user from Firebase Realtime Database.
 * @param {string} userId - The user's ID.
 * @returns {Promise<Array<object>>} - A promise that resolves with an array of contacts.
 */
export async function getUserContacts(userId) {
    const contactsRef = ref(database, `users/${userId}/contacts`);
    try {
        const snapshot = await get(contactsRef);
        if (snapshot.exists()) {
            const contacts = [];
            snapshot.forEach(childSnapshot => {
                contacts.push({ ...childSnapshot.val(), id: childSnapshot.key });
            });
            return contacts;
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
}

/**
 * Retrieves all user names from the Firebase Realtime Database.
 * @returns {Promise<Array<string>>} - A promise that resolves with an array of user names.
 */
export async function getAllUserNames() {
    const usersRef = ref(database, 'users');
    try {
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
            const userNames = [];
            snapshot.forEach(childSnapshot => {
                const user = childSnapshot.val();
                if (user.name) {
                    userNames.push(user.name);
                }
            });
            return userNames;
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
}
