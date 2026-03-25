const button = document.getElementById("open-btn");

button.addEventListener("click", () => {
  window.electronAPI.openFile().then((content) => {
    console.log(content);
  });
});
