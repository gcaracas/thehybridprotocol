export function init_wow() {
  const { WOW } = require("wowjs");
  
  // Reduced timeout for better mobile performance
  setTimeout(() => {
    /* Wow init */
    if (document.body.classList.contains("appear-animate")) {
      document
        .querySelectorAll(".wow")
        .forEach((el) => el.classList.add("no-animate"));
    }
    var wow = new WOW({
      boxClass: "wow",
      animateClass: "animated", // Fixed animation class name
      offset: 50, // Reduced offset for better mobile detection
      mobile: true, // Enable on mobile devices
      live: false,
      callback: function (box) {
        box.classList.add("animated");
      },
    });

    if (document.body.classList.contains("appear-animate")) {
      wow.init();
    } else {
      document
        .querySelectorAll(".wow")
        .forEach((el) => (el.style.opacity = "1"));
    }

    /* Wow for portfolio init */
    if (document.body.classList.contains("appear-animate")) {
      document
        .querySelectorAll(".wow-p")
        .forEach((el) => el.classList.add("no-animate"));
    }
    var wow_p = new WOW({
      boxClass: "wow-p",
      animateClass: "animated", // Fixed animation class name
      offset: 50, // Reduced offset for better mobile detection
      mobile: true, // Enable on mobile devices
      live: false,
      callback: function (box) {
        box.classList.add("animated");
      },
    });

    if (document.body.classList.contains("appear-animate")) {
      wow_p.init();
    } else {
      document
        .querySelectorAll(".wow-p")
        .forEach((el) => (el.style.opacity = "1"));
    }

    /* Wow for menu bar init - simplified for mobile */
    if (document.body.classList.contains("appear-animate")) {
      document.querySelectorAll(".wow-menubar").forEach((el) => {
        el.classList.add("no-animate", "fadeInDown", "animated");
        // Reduced interval for mobile
        setTimeout(() => {
          el.classList.remove("no-animate");
        }, 800);
      });
    } else {
      document
        .querySelectorAll(".wow-menubar")
        .forEach((el) => (el.style.opacity = "1"));
    }
  }, 200); // Reduced timeout for faster initialization
}
