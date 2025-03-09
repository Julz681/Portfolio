// async function init() {
//   await includeHTML();
// }

// async function includeHTML() {
//   let sidebarRef = document.getElementById("sidebarRef");
//   let headerRef = document.getElementById("headerRef");
//   let sidebarRefFile = sidebarRef.getAttribute("w3-include-html");
//   let headerRefFile = headerRef.getAttribute("w3-include-html");
//   await fetchFile(sidebarRef, sidebarRefFile);
//   await fetchFile(headerRef, headerRefFile);
// }

// async function fetchFile(element, file) {
//   if (!file) return;
//   try {
//     const response = await fetch(file);
//     if (!response.ok) {
//       throw new Error("Page not found.");
//     }
//     element.innerHTML = await response.text();
//   } catch (error) {
//     element.innerHTML = error.message;
//   } finally {
//     element.removeAttribute("w3-include-html");
//   }
// }

async function init() {
  await includeHTML();
}

async function includeHTML() {
  let generalFrameRef = document.getElementById("general-frame");
  let generalFrameFile = generalFrameRef.getAttribute("w3-include-html");
  await fetchFile(generalFrameRef, generalFrameFile);
}

async function fetchFile(element, file) {
  if (!file) return;
  try {
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error("Page not found.");
    }
    element.innerHTML = await response.text();
  } catch (error) {
    element.innerHTML = error.message;
  } finally {
    element.removeAttribute("w3-include-html");
  }
}
