// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  const path = require("path");
  const os = require("os");
  const { ipcRenderer } = require("electron");

  // Setup front vars
  document.getElementById("output-path").innerText = path.join(
    os.homedir(),
    "imageshrink"
  );

  const form = document.getElementById("image-form");
  const slider = document.getElementById("slider");
  const img = document.getElementById("img");

  // onSubmit
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const imgPath = img.files[0].path;
    const quality = slider.value;

    ipcRenderer.send("image:minimize", {
      imgPath,
      quality,
    });
  });
});
