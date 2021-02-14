const fixNames = () => {
  const prefferedPrefix = "Mr";
  const prefferedName = "Danielle Osborn Maywood";

  // Fix the learn page top right usertext that
  // is incorrect.
  Array.from(document.getElementsByClassName("usertext")).forEach((usertext) => {
    usertext.innerHTML = prefferedName;
  });

  // If this is normal learn page.
  if (location.href.startsWith("https://learn.lboro.ac.uk/my")) {
    document
      .getElementById("inst51055")
      .getElementsByClassName("card-body")[0]
      .getElementsByClassName("card-text")[0]
      .getElementsByTagName("table")[0]
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("tr")[1]
      .getElementsByTagName("td")[0]
      .getElementsByTagName("strong")[0].innerHTML = prefferedName;
  }

  // If this is on the user edit page.
  if (location.href.startsWith("https://learn.lboro.ac.uk/user/edit.php")) {
    document
      .getElementById("region-main")
      .getElementsByTagName("div")[0]
      .getElementsByTagName("h2")[0].innerHTML = prefferedName;
  }

  // If this is the timetable page.
  if (location.href.startsWith("https://lucas.lboro.ac.uk/its_apx/")) {
    // Remove the name it is completely pointless.
    document
      .getElementById("main-header-menu")
      .getElementsByTagName("ul")[0]
      .getElementsByTagName("li")[8]
      .getElementsByTagName("span")[0]
      .getElementsByTagName("a")[0].innerHTML = `Logout`;
  }

  // If this is the results page
  if (location.href.startsWith("https://lucas.lboro.ac.uk/cc-apx/")) {
    const element = document //
      .getElementById("main-content")
      .getElementsByTagName("div")[2]
      .getElementsByTagName("h3")[0];

    const split0 = element.innerHTML.split(",");
    const split1 = split0[1].split(";");
    const resultsFor = split0[0];
    const course = split1[1];
    const part = split1[2];

    element.innerHTML = `${resultsFor}, ${prefferedPrefix} ${prefferedName};${course};${part}`;
  }

  // If this is the bank details page
  if (location.href.startsWith("https://lucas.lboro.ac.uk/pub-apx/")) {
    const element = document //
      .getElementById("main-content")
      .getElementsByTagName("div")[1]
      .getElementsByTagName("h3")[0];

    const studentNo = element.innerHTML.split("(")[1];

    element.innerHTML = `${prefferedPrefix} ${prefferedName} (${studentNo}`;
  }
};

// check every second incase a page reload
// causes names to be incorrect again.
fixNames();
setInterval(fixNames, 1000);
