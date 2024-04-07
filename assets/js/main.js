function header() {
  const dateHeader = document.getElementById("date");
  const taskCount = document.getElementById("task-count");
  const completetask = document.getElementById("complete_task");

  let storage = JSON.parse(localStorage.getItem("todolist"));
  storage = storage ? storage : [];

  dateHeader.innerHTML = moment(new Date()).format("ddd, LL");
  taskCount.innerHTML = `${storage.length}`;

  // Calculate the number completed tasks
  const completedTasks = storage.filter((task) => task.resolved).length;
  completetask.innerHTML = `${completedTasks}`;
}

function listSection() {
  let storage = JSON.parse(localStorage.getItem("todolist"));
  // if there is no item in localstorage, initialize new object array
  storage = storage ? storage : [];

  let list = document.getElementById("list");
  list.innerHTML = "";

  // create a div element with class name 'cards'
  function cardElements(id, title, createdAt, resolved) {
    // set time with momentjs
    const time = moment(createdAt).fromNow();

    return `
      <div class="cards ${resolved ? "resolved" : null}">
        <button
          class="fas fa-check btn resolved-btn ${resolved ? "active" : null}"
          value=${id}
        ></button>
        <div class="cards-info">
          <h3 class="task">${title}</h3>
          <p class="time">${time}</p>
        </div>
        <button value=${id} class="fas fa-times btn delete-btn"></button>
      </div>
    `;
  }

  storage.reverse().map((elem) => {
    list.innerHTML += cardElements(
      elem.id,
      elem.title,
      elem.createdAt,
      elem.resolved
    );
  });

  listAction();
}

function listAction() {
  const deleteBtn = document.querySelectorAll(".cards .delete-btn");
  const resolvedBtn = document.querySelectorAll(".cards .resolved-btn");

  // initialize delete list function
  function deleteList(listID) {
    let storage = JSON.parse(localStorage.getItem("todolist"));
    // if there is no item in localstorage, initialize new object array
    storage = storage ? storage : [];

    const res = storage.filter((elem) => {
      return elem.id !== listID;
    });

    localStorage.setItem("todolist", JSON.stringify(res));
  }

  function resolvedList(listID) {
    let storage = JSON.parse(localStorage.getItem("todolist"));
    storage = storage ? storage : [];

    storage.map((elem) => {
      if (elem.id === listID) {
        elem.resolved = !elem.resolved;
      }
      return elem;
    });

    localStorage.setItem("todolist", JSON.stringify(storage));

    // Dispatch the custom event after updating local storage
    const event = new CustomEvent("taskUpdated");
    document.dispatchEvent(event);
  }

  deleteBtn.forEach((elem) => {
    elem.addEventListener("click", (event) => {
      deleteList(event.target.value);

      // update data
      listSection();
      header();
    });
  });

  resolvedBtn.forEach((elem) => {
    elem.addEventListener("click", (event) => {
      resolvedList(event.target.value);

      // update data
      listSection();
    });
  });
}

(function () {
  const inputField = document.getElementsByClassName("form-control")[0];
  const submitBtn = document.getElementById("submit-btn");

  // read user typing
  inputField.addEventListener("keyup", (event) => {
    inputField.value = event.target.value;
  });

  function handleSubmit() {
    let storage = JSON.parse(localStorage.getItem("todolist"));
    // if there is no item in localstorage, initialize new object array
    storage = storage ? storage : [];

    // create unique ID for each list
    const listID = [];
    const alphabet =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 10; i++) {
      listID[i] = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }

    if (inputField.value.length > 0) {
      // insert new data into storage array object
      storage.push({
        id: listID.join(""),
        title: inputField.value,
        createdAt: new Date(),
        resolved: false,
      });

      // update local storage with new data
      localStorage.setItem("todolist", JSON.stringify(storage));

      listSection();
      header();
      inputField.value = "";
    }
  }

  submitBtn.onclick = () => handleSubmit();
  inputField.onkeypress = (event) => {
    event.keyCode === 13 ? handleSubmit() : null;
  };
})();

window.onload = () => {
  let storage = JSON.parse(localStorage.getItem("todolist"));
  storage = storage ? storage : [];

  const today = new Date();
  const defaultDate = new Date(
    new Date(today.getTime()).setDate(today.getDate() - 1)
  );

  if (storage.length === 0) {
    const manual = [
      {
        id: "Rb5B80r8jj",
        resolved: false,
        title: "Going to Gym",
        createdAt: defaultDate,
      },
      {
        id: "eV4B60r5Fc",
        resolved: false,
        title: "Grocery Shopping",
        createdAt: defaultDate,
      },
      {
        id: "pY2v99r0Ff",
        resolved: true,
        title: "Meeting",
        createdAt: defaultDate,
      },
    ];

    storage.push(...manual);
    localStorage.setItem("todolist", JSON.stringify(storage));
  }

  // Define a callback function to update the header after storage is updated
  const updateHeaderCallback = () => {
    header();
  };

  header();
  listSection(updateHeaderCallback);

  // Listen for the custom event and update the header
  document.addEventListener("taskUpdated", () => {
    updateHeaderCallback();
  });

  // Manually trigger the taskUpdated event after initial rendering
  const event = new CustomEvent("taskUpdated");
  document.dispatchEvent(event);
};

//! NAVIGATION BAR HIDE
// Wait for the DOM content to be fully loaded before executing JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Get the header element
  const header = document.querySelector("header");

  // Variable to store the previous scroll position
  let prevScrollPos = window.pageYOffset;

  // Function to handle scroll event
  function handleScroll() {
    // Get the current scroll position
    let currentScrollPos = window.pageYOffset;

    // Check if the current scroll position is greater than the previous scroll position
    if (prevScrollPos > currentScrollPos) {
      // Show the header if scrolling up
      header.style.top = "0";
    } else {
      // Hide the header if scrolling down
      header.style.top = `-${header.offsetHeight}px`;
    }

    // Update the previous scroll position
    prevScrollPos = currentScrollPos;
  }

  // Add scroll event listener to window
  window.addEventListener("scroll", handleScroll);
});
