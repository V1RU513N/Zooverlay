const { createElement } = require("../lib/elements");

const Title = () => {
  return createElement(
    "h1",
    {
      className: "title",
    },
    [
      createElement("img", {
        src: "assets/lbmzoo.jpg",
        className: "title__icon",
      }),
    ]
  );
};

module.exports = Title;
