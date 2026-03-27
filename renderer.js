const button = document.getElementById("open-btn");

button.addEventListener("click", () => {
  window.electronAPI.openFile().then((content) => {
    if (!content) {
      console.log("No file selected.");
      return;
    }
    console.log("File loaded successfully! Processing...");

    const rows = parseCSV(content); // 1. Parse CSV string into an array of objects
    const counts = countPunches(rows); // 2. Pass those rows to count punches
    const shifts = getShifts(rows, counts); // 3. Pass rows & counts to get shifts
    const finalResults = calculateShifts(shifts); // 4. Calculate final hours

    const tbody = document.getElementById("table-body");
    tbody.innerHTML = "";

    Object.entries(finalResults)
      .sort(([keyA], [keyB]) => {
        const [nameA, dateA] = keyA.split("|");
        const [nameB, dateB] = keyB.split("|");
        if (nameA !== nameB) {
          return nameA.localeCompare(nameB);
        }
        return new Date(dateA) - new Date(dateB);
      })
      .forEach(([key, shift]) => {
        const [name, date] = key.split("|");
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${name}</td>
        <td>${date}</td>
        <td>${shift.entry}</td>
        <td>${shift.exit}</td>
        <td>${shift.hoursWorked}</td>
      `;
        if (shift.hoursWorked === "???") {
          row.classList.add("suspicious");
        }
        tbody.appendChild(row);
      });

    console.log("Filtered Results:", finalResults);
  });
});
