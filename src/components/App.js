const { createElement } = require("../lib/elements");
const CloseButton = require("./CloseButton");
const NewLink = require("./NewLink");
const Title = require("./Title");
const WebsiteForm = require("./WebsiteForm");
const WebsiteNav = require("./WebsiteNav");
const { shell } = require("electron");

const App = () => {
  const newLink = NewLink();
  const websiteNav = WebsiteNav();
  const main = createElement(
    "main",
    {
      className: "main",
    },
    [WebsiteForm()]
  );

  const refreshMain = () => {
    main.innerHTML = "";
    main.append(WebsiteForm());
  };

  window.addEventListener("popstate", () => {
    if (location.hash === "") {
      newLink.classList.add("nav__link-active");
      refreshMain();
    } else {
      newLink.classList.remove("nav__link-active");
    }
    for (let child of websiteNav.children) {
      if (location.hash === child.hash) {
        child.classList.add("nav__link-active");
        refreshMain();
      } else {
        child.classList.remove("nav__link-active");
      }
    }
  });

  return createElement(
    "div",
    {
      className: "layout",
    },
    [
      createElement(
        "aside",
        {
          className: "aside",
        },
        [
          Title(),
          newLink,
          websiteNav,
          createElement("button", {
            className: "support",
            innerText: "V12U513N",
            onclick: () =>
              shell.openExternal("https://twitter.com/V12U513N"),
          }),
        ]
      ),
      createElement("div", { className: "toolbar" }, [CloseButton()]),
      main,
    ]
  );
};

module.exports = App;
