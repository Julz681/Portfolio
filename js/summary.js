// Import necessary Firebase functions and configuration
import { auth, firestore } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

/**
 * Wartet darauf, dass die Seite vollständig geladen ist, und initialisiert die Begrüßung und die Benutzerdaten.
 */
document.addEventListener("DOMContentLoaded", () => {
    checkAuthState();
    updateTaskMetrics();
});

/**
 * Überprüft den Authentifizierungsstatus und aktualisiert die Begrüßung und die Benutzerinitialen.
 */
async function checkAuthState() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userName = await getUserName(user.uid);
            const userInitials = getUserInitials(userName);
            updateGreeting(userName);
            updateUserProfile(userInitials);
        } else {
            const guestName = "Guest";
            const guestInitials = "G";
            updateGreeting(guestName);
            updateUserProfile(guestInitials);
        }
    });
}

/**
 * Ruft den Benutzernamen aus Firestore ab.
 * @param {string} uid - Die UID des angemeldeten Benutzers.
 * @returns {string} - Der Benutzername oder "Guest" bei Fehler.
 */
async function getUserName(uid) {
    try {
        const userDoc = doc(firestore, "users", uid);
        const userSnap = await getDoc(userDoc);
        return userSnap.exists() ? userSnap.data().name : "Guest";
    } catch (error) {
        console.error("Fehler beim Abrufen des Benutzernamens:", error);
        return "Guest";
    }
}

/**
 * Ermittelt die Initialen aus einem gegebenen Namen.
 * @param {string} name - Der vollständige Benutzername.
 * @returns {string} - Die Initialen des Benutzers.
 */
function getUserInitials(name) {
    return name.split(" ").map(word => word.charAt(0)).join("").toUpperCase();
}

/**
 * Aktualisiert die Begrüßungsnachricht basierend auf der Tageszeit.
 * @param {string} userName - Der Benutzername zur Anzeige in der Begrüßung.
 */
function updateGreeting(userName) {
    const greetingElement = document.getElementById("greeting-name");
    const currentHour = new Date().getHours();
    let greetingText = "Good morning";

    if (currentHour >= 12 && currentHour < 18) {
        greetingText = "Good afternoon";
    } else if (currentHour >= 18 || currentHour < 5) {
        greetingText = "Good evening";
    }

    greetingElement.innerHTML = `${greetingText}, <br><span class='highlight'>${userName}</span>`;
}

/**
 * Aktualisiert das Benutzerprofil und zeigt die Initialen im Profilbereich an.
 * @param {string} initials - Die Benutzerinitialen zur Anzeige.
 */
function updateUserProfile(initials) {
    const userProfile = document.getElementById("user-initials");
    userProfile.textContent = initials;
}

/**
 * Aktualisiert die Task-Metriken auf dem Dashboard.
 */
function updateTaskMetrics() {
    const todoCount = document.querySelectorAll(".to-do-wrapper .board-card").length;
    const doneCount = document.querySelectorAll(".done-wrapper .board-card").length;
    const totalCount = todoCount + doneCount;

    const todoElement = document.querySelector(".metrics .metric-box:nth-of-type(1) h2");
    const doneElement = document.querySelector(".metrics .metric-box:nth-of-type(2) h2");
    const totalElement = document.querySelector(".wrapper_tasks .metric-box-tasks:nth-of-type(1) h2");

    if (todoElement) todoElement.textContent = todoCount;
    if (doneElement) doneElement.textContent = doneCount;
    if (totalElement) totalElement.textContent = totalCount;
}
