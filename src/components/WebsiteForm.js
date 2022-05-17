const { createElement } = require("../lib/elements");
const {
  getWebsite,
  deleteWebsite,
  updateWebsite,
  addWebsite,
  listenWebsites,
} = require("../lib/storage");
const HotkeyInput = require("./HotkeyInput");
const LabeledInput = require("./LabeledInput");

const WebsiteForm = () => {
  const websiteId = +location.hash.replace("#", "");
  let website = getWebsite(websiteId);
  let isNew = false;
  if (!website) {
    isNew = true;
    website = { bounds: {}, crop: {} };
  }
  const handleChange = () => {
    if (!isNew) {
      form.requestSubmit();
    }
  };

  const xInput = LabeledInput({
    type: "number",
    text: "X",
    name: "x",
    value: website.bounds.x ?? 100,
    oninput: handleChange,
  });

  const yInput = LabeledInput({
    type: "number",
    text: "Y",
    name: "y",
    value: website.bounds.y ?? 100,
    oninput: handleChange,
  });

  const widthInput = LabeledInput({
    type: "number",
    text: "Largeur",
    name: "width",
    value: website.bounds.width ?? 800,
    oninput: handleChange,
  });

  const heightInput = LabeledInput({
    type: "number",
    text: "Hauteur",
    name: "height",
    value: website.bounds.height ?? 600,
    oninput: handleChange,
  });

  listenWebsites((websites) => {
    const existingWebsite = websites.find(
      (website) => website.id === websiteId
    );
    if (existingWebsite) {
      xInput.children[0].value = existingWebsite.bounds.x;
      yInput.children[0].value = existingWebsite.bounds.y;
      widthInput.children[0].value = existingWebsite.bounds.width;
      heightInput.children[0].value = existingWebsite.bounds.height;
    }
  });

  const form = createElement(
    "form",
    {
      className: "form",
      onsubmit: (event) => {
        event.preventDefault();
        if (!isNew) {
          website = getWebsite(websiteId);
        }
        const {
          name,
          height,
          width,
          url,
          frame,
          transparent,
          alwaysOnTop,
          resizable,
          clickThrough,
          movable,
          toggleHotkey,
          x,
          y,
          cropLeft,
          cropRight,
          cropTop,
          cropBottom,
          opacity,
          borderRadius,
        } = event.target.elements;
        website.name = name.value;
        if (!website.id) {
          website.id = Date.now();
        }
        website.bounds = {
          height: +height.value,
          width: +width.value,
          x: +x.value,
          y: +y.value,
        };
        website.crop = {
          left: +cropLeft.value,
          right: +cropRight.value,
          top: +cropTop.value,
          bottom: +cropBottom.value,
        };
        website.url = url.value;
        website.frame = frame.checked;
        website.transparent = transparent.checked;
        website.alwaysOnTop = alwaysOnTop.checked;
        website.resizable = resizable.checked;
        website.clickThrough = clickThrough.checked;
        website.movable = movable.checked;
        website.toggleHotkey = toggleHotkey.value;
        website.opacity = +opacity.value;
        website.borderRadius = +borderRadius.value;
        if (isNew) {
          addWebsite(website);
          location.href = `#${website.id}`;
        } else {
          updateWebsite(websiteId, website);
        }
      },
    },
    [
      LabeledInput({
        text: "Nom",
        className: "full",
        name: "name",
        placeholder: "Nom",
        value: website.name ?? "",
        required: true,
      }),
      LabeledInput({
        text: "URL",
        className: "full",
        name: "url",
        placeholder: "https://...",
        value: website.url ?? "",
        required: true,
      }),
      xInput,
      yInput,
      widthInput,
      heightInput,
      LabeledInput({
        type: "number",
        text: "Recadrage Gauche",
        name: "cropLeft",
        value: website.crop?.left ?? 0,
        oninput: handleChange,
      }),
      LabeledInput({
        type: "number",
        text: "Recadrage Droite",
        name: "cropRight",
        value: website.crop?.right ?? 0,
        oninput: handleChange,
      }),
      LabeledInput({
        type: "number",
        text: "Recadrage Haut",
        name: "cropTop",
        value: website.crop?.top ?? 0,
        oninput: handleChange,
      }),
      LabeledInput({
        type: "number",
        text: "Recadrage Bas",
        name: "cropBottom",
        value: website.crop?.bottom ?? 0,
        oninput: handleChange,
      }),
      LabeledInput({
        type: "range",
        text: "Opacité",
        name: "opacity",
        min: 0,
        max: 1,
        step: 0.01,
        value: website.opacity ?? 1,
        oninput: handleChange,
      }),
      LabeledInput({
        type: "range",
        text: "Rayon de bordure",
        name: "borderRadius",
        min: 0,
        max: 100,
        value: website.borderRadius ?? 0,
        oninput: handleChange,
      }),
      LabeledInput({
        type: "checkbox",
        text: "Contour",
        name: "frame",
        checked: website.frame ?? true,
        oninput: handleChange,
      }),
      LabeledInput({
        type: "checkbox",
        text: "Transparent",
        name: "transparent",
        checked: website.transparent ?? true,
        oninput: handleChange,
      }),
      LabeledInput({
        type: "checkbox",
        text: "Déplaçable",
        name: "movable",
        checked: website.movable ?? true,
        oninput: handleChange,
      }),
      LabeledInput({
        type: "checkbox",
        text: "Toujours au dessus",
        name: "alwaysOnTop",
        checked: website.alwaysOnTop ?? true,
        oninput: handleChange,
      }),
      LabeledInput({
        type: "checkbox",
        text: "Redimensionnable",
        name: "resizable",
        checked: website.resizable ?? true,
        oninput: handleChange,
      }),
      LabeledInput({
        type: "checkbox",
        text: "Non cliquable",
        name: "clickThrough",
        checked: website.clickThrough ?? false,
        oninput: handleChange,
      }),
      HotkeyInput({ value: website.toggleHotkey, oninput: handleChange }),
      createElement("input", {
        className: "full",
        type: "submit",
        value: "Sauvegarde",
      }),
      createElement("button", {
        innerText: "Supprime",
        className: "full danger",
        disabled: isNew,
        title: "Delete website",
        onclick: () => {
          location.href = "#";
          deleteWebsite(website);
        },
      }),
    ]
  );

  return form;
};

module.exports = WebsiteForm;
