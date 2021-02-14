const fixNames = () => {
  const prefferedName = "Danielle Osborn Maywood";

  // Fix the learn page top right usertext that
  // is incorrect.
  Array.from(document.getElementsByClassName("usertext")).forEach((usertext) => {
    usertext.innerHTML = prefferedName;
  });

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

    element.innerHTML = `${resultsFor}, ${prefferedName};${course};${part}`;
  }
};

// check every second incase a page reload
// causes names to be incorrect again.
fixNames();
setInterval(fixNames, 1000);
