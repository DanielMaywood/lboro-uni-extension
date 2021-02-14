const createTimetableExport = () => {
  const timetableDiv = document.getElementById("timetable");
  const careerDiv = document.getElementById("career");

  const button = document.createElement("div");
  const text = document.createTextNode("Export");

  button.setAttribute("id", "export_timetable");
  button.setAttribute(
    "style",
    "padding:5px; margin:0px 10px 10px 0px; font-weight:600; font-size:115%; background-color:#CC0066; color:white; float:right; cursor:pointer;"
  );
  button.appendChild(text);
  timetableDiv.insertBefore(button, careerDiv.nextSibling);

  button.addEventListener("click", () => {
    /**
     * Split the timetable body into on demand and
     * timetabled lectures/workshops/labs.
     * @param {Element} body
     */
    const splitIntoOnDemandAndTimetable = (body) => {
      const onDemand = [];
      const timetable = {};

      let isOnDemand = true;
      let currentDayOfWeek = "";

      for (let i = 0; i < body.childElementCount; ++i) {
        const elem = body.children[i];

        // We only care about tt_info_row as they contain
        // lecture information.
        if (elem.classList.contains("tt_info_row")) {
          if (isOnDemand) {
            onDemand.push(elem);
          } else {
            const weekday = elem.getElementsByClassName("weekday");
            if (weekday.length > 0) {
              currentDayOfWeek = weekday[0].innerHTML;
              timetable[currentDayOfWeek] = [];
            }
            timetable[currentDayOfWeek].push(elem);
          }
        }
        // In the format of the table
        // <tr style="height:1%">   // ON DEMAND CONTENT
        // <tr class="tt_info_row">
        // <tr>                     // We switch isOnDemand here.
        // <tr style="height:1%">   // TIMETABLED CONTENT
        // <tr class="tt_info_row">
        else if (elem.getAttribute("style") == null) {
          isOnDemand = false;
        }
      }

      return { onDemand, timetable };
    };

    /**
     * Parse `Weeks: Sem 1/2: 1,3-4,7,9-10` format.
     * @param {string} weeks
     */
    const getWeeksFromLboroFormat = (weeks) => {
      return weeks
        .substr("Weeks: Sem 1:".length)
        .split(",")
        .map((week) => week.trim())
        .reduce((acc, week) => {
          if (week.includes(" - ")) {
            const [start, end] = week.split(" - ").map((week) => parseInt(week));
            return acc.concat(Array.from({ length: end - start + 1 }, (v, k) => start + k));
          } else {
            return acc.concat(parseInt(week));
          }
        }, []);
    };

    /**
     * Get lecture from an element.
     * @param {Element} elem
     */
    const getLectureFromElem = (elem) => {
      const code = elem.getElementsByClassName("tt_module_id_row")[0].innerHTML;
      const name = elem.getElementsByClassName("tt_module_name_row")[0].innerHTML;
      const type = elem.getElementsByClassName("tt_modtype_row")[0].innerHTML;
      const weeks = getWeeksFromLboroFormat(elem.getElementsByClassName("tt_weeks_row")[0].innerHTML);
      const lecturer = elem.getElementsByClassName("tt_lect_row")[0].innerHTML;

      return { code, name, type, weeks, lecturer };
    };

    /**
     * Get lectures from a timetable day element.
     * @param {Array<Element>} timetableDay
     */
    const getLecturesFromTimetableDay = (timetableDay) => {
      const lectures = [];

      const lectureElems = timetableDay.reduce((acc, day) => {
        return acc
          .concat(Array.from(day.getElementsByClassName("new_row_tt_info_cell")))
          .concat(Array.from(day.getElementsByClassName("tt_info_cell")));
      }, []);

      for (let i = 0; i < lectureElems.length; ++i) {
        lectures.push(getLectureFromElem(lectureElems[i]));
      }

      return lectures;
    };

    /**
     * Get the semester selected.
     */
    const getSemester = () => {
      const semester = document.getElementById("P2_MY_PERIOD").value;
      const valid = semester != "sem 1" && semester != "sem 2";

      return [valid ? semester : null, !valid];
    };

    /**
     * Get weeks starting dates.
     * @param {string} semester
     */
    const getStartingDatesForSemester = (semester) => {
      const semesterText = semester == "sem 1" ? "Sem 1" : "Sem 2";
      const dates = [];

      const datesBody = document.getElementById("P2_MY_PERIOD");
      for (let i = 0; i < datesBody.childElementCount; ++i) {
        const elem = datesBody.children[i];
        const date = elem.innerHTML;

        if (date.startsWith(semesterText)) {
          const dateRegex = new RegExp(
            `${semesterText} - Wk (?<weekNumber>\\d+) \\(starting (?<weekDate>\\d+-\\w+-\\d+)\\)`
          );
          const regexMatch = date.match(dateRegex);

          dates.push({
            week: regexMatch.groups["weekNumber"],
            date: regexMatch.groups["weekDate"],
          });
        }
      }

      return dates;
    };

    const [semester, isInvalidSemester] = getSemester();
    if (isInvalidSemester) {
      alert("You must set Period to be either Semester 1 or Semester 2");
      return;
    }

    const timetableDiv = document.getElementById("timetable_details");
    const timetableBody = timetableDiv.getElementsByTagName("tbody")[0];

    // console.log(timetableBody);

    const { timetable, onDemand } = splitIntoOnDemandAndTimetable(timetableBody);

    console.log(timetableBody);
    console.log(onDemand);
    console.log(timetable);

    console.log(getLecturesFromTimetableDay(timetable["Monday"]));

    console.log(getStartingDatesForSemester(semester));
  });
};

// We run this every second because if the student changes "Period" it causes
// the timetable to refresh and delete our created export button.
// TODO: Make this more efficient, find a callback ran or something that we
// can use to make it reactive rather than polling.
setInterval(() => {
  const exportTimetable = document.getElementById("export_timetable");

  if (!exportTimetable) {
    createTimetableExport();
  }
}, 1000);
