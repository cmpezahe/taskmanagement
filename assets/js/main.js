// ===== Page Functions =====
jQuery(document).ready(function () {
  var mainContent = $(".cd-main-content"),
    header = $(".cd-main-header"),
    sidebar = $(".cd-side-nav"),
    sidebarTrigger = $(".cd-nav-trigger"),
    topNavigation = $(".cd-top-nav"),
    searchForm = $(".cd-search"),
    accountInfo = $(".account");

  var resizing = false;
  moveNavigation();
  $(window).on("resize", function () {
    if (!resizing) {
      !window.requestAnimationFrame
        ? setTimeout(moveNavigation, 300)
        : window.requestAnimationFrame(moveNavigation);
      resizing = true;
    }
  });

  var scrolling = false;
  checkScrollbarPosition();
  $(window).on("scroll", function () {
    if (!scrolling) {
      !window.requestAnimationFrame
        ? setTimeout(checkScrollbarPosition, 300)
        : window.requestAnimationFrame(checkScrollbarPosition);
      scrolling = true;
    }
  });

  sidebarTrigger.on("click", function (event) {
    event.preventDefault();
    $([sidebar, sidebarTrigger]).toggleClass("nav-is-visible");
  });

  $(".has-children > a").on("click", function (event) {
    var mq = checkMQ(),
      selectedItem = $(this);
    if (mq == "mobile" || mq == "tablet") {
      event.preventDefault();
      if (selectedItem.parent("li").hasClass("selected")) {
        selectedItem.parent("li").removeClass("selected");
      } else {
        sidebar.find(".has-children.selected").removeClass("selected");
        selectedItem.parent("li").addClass("selected");
      }
    }
  });

  sidebar.children("ul").menuAim({
    activate: function (row) {
      $(row).addClass("hover");
    },
    deactivate: function (row) {
      $(row).removeClass("hover");
    },
    exitMenu: function () {
      sidebar.find(".hover").removeClass("hover");
      return true;
    },
    submenuSelector: ".has-children",
  });

  function checkMQ() {
    return window
      .getComputedStyle(document.querySelector(".cd-main-content"), "::before")
      .getPropertyValue("content")
      .replace(/'/g, "")
      .replace(/"/g, "");
  }

  function moveNavigation() {
    var mq = checkMQ();

    if (mq == "mobile" && topNavigation.parents(".cd-side-nav").length == 0) {
      detachElements();
      topNavigation.appendTo(sidebar);
    } else if (
      (mq == "tablet" || mq == "desktop") &&
      topNavigation.parents(".cd-side-nav").length > 0
    ) {
      detachElements();
      searchForm.insertAfter(header.find(".cd-logo"));
      topNavigation.appendTo(header.find(".cd-nav"));
    }
    checkSelected(mq);
    resizing = false;
  }

  function detachElements() {
    topNavigation.detach();
  }

  function checkSelected(mq) {
    if (mq == "desktop") $(".has-children.selected").removeClass("selected");
  }

  function checkScrollbarPosition() {
    var mq = checkMQ();

    if (mq != "mobile") {
      var sidebarHeight = sidebar.outerHeight(),
        windowHeight = $(window).height(),
        mainContentHeight = mainContent.outerHeight(),
        scrollTop = $(window).scrollTop();

      scrollTop + windowHeight > sidebarHeight &&
      mainContentHeight - sidebarHeight != 0
        ? sidebar.addClass("is-fixed").css("bottom", 0)
        : sidebar.removeClass("is-fixed").attr("style", "");
    }
    scrolling = false;
  }
});

// ===== Get Local Time ======
class DateTimeDisplay {
  constructor(dateElementId, timeElementId) {
    this.dateElement = document.getElementById(dateElementId);
    this.timeElement = document.getElementById(timeElementId);

    // Initial call to display the date and time immediately
    this.updateDateTime();

    // Update the date and time every second (1000 milliseconds)
    setInterval(() => this.updateDateTime(), 1000);
  }

  updateDateTime() {
    // Get the current date and time
    const currentDate = new Date();

    // Extract the components of the date and time
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Months are zero-based
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    // Format the date and time as strings
    const formattedDate = `${year}-${this.addLeadingZero(
      month
    )}-${this.addLeadingZero(day)}`;
    const formattedTime = `${this.addLeadingZero(hours)}:${this.addLeadingZero(
      minutes
    )}:${this.addLeadingZero(seconds)}`;

    // Display the date and time in HTML elements
    this.dateElement.innerText = `${formattedDate}`;
    this.timeElement.innerText = ` ${formattedTime}`;
  }

  addLeadingZero(number) {
    return (number < 10 ? "0" : "") + number;
  }
}

// Create an instance of DateTimeDisplay with element IDs
const dateTimeDisplay = new DateTimeDisplay("date", "liveClock");
// ===== End Get Local Time =====
// ===== filter ====
document.addEventListener("DOMContentLoaded", function () {
  // Initially hide elements with classes filter-geo and filter-wind
  document
    .querySelectorAll(".filter-work, .filter-other")
    .forEach((element) => {
      element.style.display = "none";
    });

  let filterItems = document.querySelectorAll(".temp_filters li");

  function activePortfolio() {
    filterItems.forEach((el) => {
      el.classList.remove("filter-active");
      this.classList.add("filter-active");

      // Show or hide elements based on the selected filter
      let selectedFilter = this.getAttribute("data-filter");
      document.querySelectorAll(".temp_item").forEach((item) => {
        if (item.classList.contains(selectedFilter)) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  }

  filterItems.forEach((el) => {
    el.addEventListener("click", activePortfolio);
  });

  // Mixit up filter
  let mixerPortfolio = mixitup(".task_wrap-container", {
    selectors: {
      target: ".task_item",
    },
    animation: {
      duration: 300,
    },
  });
});
