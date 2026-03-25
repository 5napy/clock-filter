function filterData(input) {
  const parseCSV = (text) => {
    const lines = text.split("\n"); //['Person Name,Punch Date,Attendance record', 'Ana Garcia,03/18/2025,07:58:00', ...]
    const headers = lines[0].split(","); //['Person Name', 'Punch Date', 'Attendance record']

    const results = [];

    lines.slice(1).forEach((line) => {
      const values = line.trim().split(","); //['Ana Garcia', '03/18/2025', '07:58:00']
      const obj = {};

      headers.forEach((header, index) => {
        obj[header] = values[index]; //{ 'Person Name': 'Ana Garcia', 'Punch Date': '03/18/2025', 'Attendance record': '07:58:00' }
      });

      results.push(obj);
    });

    return results;
  };

  // console.log(parseCSV(input));
  const rows = parseCSV(input); //individual punches

  const countPunches = (rows) => {
    const counts = {};

    rows.forEach((row) => {
      const key = row["Nombre de la Persona"] + " | " + row["Fecha de Fichaje"];

      if (key in counts) {
        counts[key] += 1;
      } else {
        counts[key] = 1;
      }
    });

    return counts;
  };

  //console.log(countPunches(rows));
  const counts = countPunches(rows); // how many punches per person per day

  const getShifts = (rows, counts) => {
    const shifts = {};

    rows.forEach((row) => {
      const key = row["Nombre de la Persona"] + "|" + row["Fecha de Fichaje"];
      const punchTime = row["Registro de Asistencia"];

      if (key in shifts) {
        if (punchTime < shifts[key].entry) {
          shifts[key].entry = punchTime;
        }
        if (punchTime > shifts[key].exit) {
          shifts[key].exit = punchTime;
        }
      } else {
        shifts[key] = {
          entry: punchTime,
          exit: punchTime,
          totalPunches: counts[key],
        };
      }
    });

    return shifts;
  };

  //console.log(getShifts(rows, counts));
  const shifts = getShifts(rows, counts);

  const timeToMinutes = (timeStr) => {
    const [hours, minutes, seconds] = timeStr.split(":");

    return parseInt(hours) * 60 + parseInt(minutes);
  };

  //console.log(timeToMinutes("07:54:25"));

  const calculateShifts = (shifts) => {
    const results = {};

    Object.entries(shifts).forEach(([key, shift]) => {
      if (shift.totalPunches === 1) {
        results[key] = { entry: shift.entry, exit: "???", hoursWorked: "???" };
      } else {
        const entryMinutes = timeToMinutes(shift.entry);
        const exitMinutes = timeToMinutes(shift.exit);
        const duration = exitMinutes - entryMinutes;
        results[key] = {
          entry: shift.entry,
          exit: shift.exit,
          hoursWorked:
            duration < 30 ? "???" : parseFloat((duration / 60).toFixed(1)),
        };
      }
    });
    return results;
  };
  const results = calculateShifts(shifts);
  console.log(results);
}

module.exports = { filterData };
