var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
const settingsButton = document.getElementById("settings-btn");
const supportButton = document.getElementById("support-btn");
const homePage = document.getElementById("home-page");
const settingsPage = document.getElementById("settings-page");
const wrapper = document.getElementById("wrapper");
const supportPage = document.getElementById("support-page");
const restoreButton = document.getElementById("restore-btn");
const formButtons = document.getElementById("form-btns");
const applyButton = document.getElementById("apply-btn");
// Check buttons
const globalCheck = document.getElementById("global_check");
const overrideCheck = document.getElementById("override_check");
const exemptCheck = document.getElementById("exempt_check");
const tipText = document.getElementById("tip");
const tipWhenOverrideOn = document.getElementById("tip-override-on");
const tipWhenOverrideOff = document.getElementById("tip-override-off");
const tipWhenSiteIsExempted = document.getElementById("tip-exempt");
const tipBox = document.getElementById("tip-box");
const globalNotSelectedInfoText = document.getElementById(
  "global_not_checked_info_text"
);
const globalFontsSelection = document.getElementById("global_fonts_selection");
const globalFontSelectionForm = document.forms["global_fonts"];
const globalSerifSelect = globalFontSelectionForm.elements["global_serif"];
const globalSansSerifSelect =
  globalFontSelectionForm.elements["global_sans_serif"];
const globalMonospaceSelect =
  globalFontSelectionForm.elements["global_monospace"];
const globalSerifPlaceholder = document.querySelector(
  "#global_serif_placeholder"
);
const globalSansSerifPlaceholder = document.querySelector(
  "#global_sans_serif_placeholder"
);
const globalMonospacePlaceholder = document.querySelector(
  "#global_monospace_placeholder"
);
tipWhenOverrideOn.remove();
tipWhenOverrideOff.remove();
tipWhenSiteIsExempted.remove();
const showTip = (tip) => {
  tipBox.removeChild(tipBox.children[0]);
  tipBox.appendChild(tip);
  return true;
};
const getDomain = () => {
  return new Promise((resolve, reject) => {
    browser.tabs.query(
      {
        active: true,
        lastFocusedWindow: true,
      },
      (tabs) => {
        if (tabs[0] && tabs[0].url) resolve(new URL(tabs[0].url).hostname);
        else reject(new Error("Could not return tab url"));
      }
    );
  });
};
// by default these extra pages are unmounted
settingsPage.remove();
supportPage.remove();
restoreButton.remove();
const goToSettings = () => {
  settingsButton.click();
};
// Check for configuration settings
browser.storage.sync.get(["global"]).then((result) =>
  __awaiter(this, void 0, void 0, function* () {
    globalCheck.checked = "global" in result && result["global"];
    if (globalCheck.checked) {
      overrideCheck.disabled = false;
      exemptCheck.disabled = false;
      globalNotSelectedInfoText.remove();
      const globalFonts = yield browser.storage.sync.get(["global_fonts"]);
      if ("global_fonts" in globalFonts) {
        const global_fonts = globalFonts["global_fonts"];
        // Placeholder text content
        globalSerifPlaceholder.innerHTML = global_fonts.serif;
        globalSansSerifPlaceholder.innerHTML = global_fonts.sans_serif;
        globalMonospacePlaceholder.innerHTML = global_fonts.monospace;
        // Placeholder value
        globalSerifPlaceholder.value =
          global_fonts.serif === "Default" ? "" : global_fonts.serif;
        globalSansSerifPlaceholder.value =
          global_fonts.sans_serif === "Default" ? "" : global_fonts.sans_serif;
        globalMonospacePlaceholder.value =
          global_fonts.monospace === "Default" ? "" : global_fonts.monospace;
      }
      browser.storage.sync.get(["override"]).then((result) => {
        const willOverride = "override" in result && result["override"];
        overrideCheck.checked = willOverride;
        showTip(willOverride ? tipWhenOverrideOn : tipWhenOverrideOff);
      });
      browser.storage.sync.get(["exempts"]).then((result) =>
        __awaiter(this, void 0, void 0, function* () {
          exemptCheck.checked =
            "exempts" in result &&
            result["exempts"].includes(yield getDomain()) &&
            showTip(tipWhenSiteIsExempted);
        })
      );
    } else {
      globalFontsSelection.remove();
    }
  })
);
settingsButton.addEventListener("click", () =>
  __awaiter(this, void 0, void 0, function* () {
    if (settingsButton.textContent.charAt(0) === "S") {
      settingsButton.textContent = "Go back";
      if (supportButton.textContent.includes("<")) supportPage.remove();
      else homePage.remove();
      supportButton.textContent = "Support";
      wrapper.appendChild(settingsPage);
      // Check for exisitng settings
      globalCheck.addEventListener("change", () =>
        __awaiter(this, void 0, void 0, function* () {
          // enable/disable the other checkboxes
          overrideCheck.disabled = !globalCheck.checked;
          exemptCheck.disabled = !globalCheck.checked;
          // Save this setting to sync storage
          yield browser.storage.sync.set({
            global: globalCheck.checked,
          });
          if (globalCheck.checked) {
            showTip(
              overrideCheck.checked ? tipWhenOverrideOn : tipWhenOverrideOff
            );
            exemptCheck.checked && showTip(tipWhenSiteIsExempted);
            globalNotSelectedInfoText.remove();
            settingsPage.appendChild(globalFontsSelection);
            // check if fonts are set for the site
            const domain = yield getDomain();
            const setFonts = yield browser.storage.sync.get([domain]);
            if (domain in setFonts) {
              yield browser.storage.sync.set({
                global_fonts: setFonts[domain],
              });
            }
            const globalFonts = yield browser.storage.sync.get([
              "global_fonts",
            ]);
            if ("global_fonts" in globalFonts) {
              const global_fonts = globalFonts["global_fonts"];
              // Placeholder text content
              globalSerifPlaceholder.innerHTML = global_fonts.serif;
              globalSansSerifPlaceholder.innerHTML = global_fonts.sans_serif;
              globalMonospacePlaceholder.innerHTML = global_fonts.monospace;
              // Placeholder value
              globalSerifPlaceholder.value =
                global_fonts.serif === "Default" ? "" : global_fonts.serif;
              globalSansSerifPlaceholder.value =
                global_fonts.sans_serif === "Default"
                  ? ""
                  : global_fonts.sans_serif;
              globalMonospacePlaceholder.value =
                global_fonts.monospace === "Default"
                  ? ""
                  : global_fonts.monospace;
            }
          } else {
            showTip(tipText);
            globalFontsSelection.remove();
            settingsPage.appendChild(globalNotSelectedInfoText);
          }
        })
      );
      overrideCheck.addEventListener("change", () =>
        __awaiter(this, void 0, void 0, function* () {
          yield browser.storage.sync.set({
            override: overrideCheck.checked,
          });
          showTip(
            overrideCheck.checked ? tipWhenOverrideOn : tipWhenOverrideOff
          );
        })
      );
      exemptCheck.addEventListener("change", () =>
        __awaiter(this, void 0, void 0, function* () {
          // Get the list of all exempted websites
          let exempted_domains = [];
          const result = yield browser.storage.sync.get(["exempts"]);
          if ("exempts" in result) exempted_domains = result["exempts"];
          const domain = yield getDomain();
          if (exemptCheck.checked && showTip(tipWhenSiteIsExempted))
            exempted_domains.push(domain);
          else {
            exempted_domains = exempted_domains.filter((el) => el !== domain);
            showTip(
              overrideCheck.checked ? tipWhenOverrideOn : tipWhenOverrideOff
            );
          }
          yield browser.storage.sync.set({
            exempts: exempted_domains,
          });
        })
      );
    } else {
      settingsButton.textContent = "Settings";
      settingsPage.remove();
      wrapper.appendChild(homePage);
    }
  })
);
supportButton.addEventListener("click", () => {
  if (supportButton.textContent.includes("Supp")) {
    supportButton.textContent = "<- Go back";
    if (settingsButton.textContent.includes("G")) settingsPage.remove();
    else homePage.remove();
    settingsButton.textContent = "Settings";
    wrapper.appendChild(supportPage);
  } else {
    supportButton.textContent = "Support";
    supportPage.remove();
    wrapper.appendChild(homePage);
  }
});
// For global
// For Domain specific
const fontSelectionForm = document.forms["fonts"];
const serifSelect = fontSelectionForm.elements["serif"];
const sansSerifSelect = fontSelectionForm.elements["sans_serif"];
const monospaceSelect = fontSelectionForm.elements["monospace"];
const serifPlaceholder = document.querySelector("#serif_placeholder");
const sansSerifPlaceholder = document.querySelector("#sans_serif_placeholder");
const monospacePlaceholder = document.querySelector("#monospace_placeholder");
// Populating placeholder values + checkbox
const updatePlaceholders = (innerText) => {
  // Placeholder text content
  serifPlaceholder.innerHTML = innerText.serif;
  sansSerifPlaceholder.innerHTML = innerText.sans_serif;
  monospacePlaceholder.innerHTML = innerText.monospace;
  // Placeholder value
  serifPlaceholder.value = innerText.serif === "Default" ? "" : innerText.serif;
  sansSerifPlaceholder.value =
    innerText.sans_serif === "Default" ? "" : innerText.sans_serif;
  monospacePlaceholder.value =
    innerText.monospace === "Default" ? "" : innerText.monospace;
};
getDomain().then((domain) => {
  browser.storage.sync.get([domain]).then((result) => {
    if (Object.keys(result).length != 0) {
      const fontData = result[domain];
      updatePlaceholders(fontData);
      formButtons.prepend(restoreButton);
    }
  });
});
// load locally installed fonts
// Load fonts into the  dropdowns
const populateFonts = (element) => {
  [
    "Inter",
    "Nunito",
    "Vollkorn",
    "Playfair",
    "Source Code Pro",
    "Fira Code",
    "Comic Neue",
    // New
    "Merriweather",
    "Atkinson Hyperlegible",
    "Charis SIL",
    // "DejaVu Sans Mono",
    // Pre-installed fonts
    "Cutive Mono",
    "Noto Serif",
    "Noto Sans",
    "Roboto",
    "Droid Sans Mono",
    "Coming Soon",
    "Dancing Script",
    "Carrois Gothic SC",
    "Source Sans Pro",
    "One UI Sans App VF",
  ].forEach((font) => {
    const option = document.createElement("option");
    option.value = font;
    option.textContent = font;
    element.appendChild(option);
  });
};
populateFonts(serifSelect);
populateFonts(sansSerifSelect);
populateFonts(monospaceSelect);
// for global fonts form
populateFonts(globalSerifSelect);
populateFonts(globalSansSerifSelect);
populateFonts(globalMonospaceSelect);
fontSelectionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const serifValue = serifSelect.value;
  const sansSerifValue = sansSerifSelect.value;
  const monospaceValue = monospaceSelect.value;
  if (!serifValue.length && !sansSerifValue.length && !monospaceValue.length)
    applyButton.innerHTML = "No Changes Made";
  else {
    applyButton.textContent = "✔ Applied";
    if (!formButtons.contains(restoreButton))
      formButtons.prepend(restoreButton);
  }
  setTimeout(() => {
    applyButton.innerHTML = "Apply Selection";
  }, 1500);
  try {
    browser.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) =>
      __awaiter(this, void 0, void 0, function* () {
        // telling the service worker to apply the font
        const fontData = {
          serif: serifValue.length ? serifValue : "Default",
          sans_serif: sansSerifValue.length ? sansSerifValue : "Default",
          monospace: monospaceValue.length ? monospaceValue : "Default",
        };
        browser.tabs.connect(tabs[0].id).postMessage({
          type: "apply_font",
          data: fontData,
        });
        // saving the fonts to sync storage
        const domain = new URL(tabs[0].url).hostname;
        if (
          serifValue.length ||
          sansSerifValue.length ||
          monospaceValue.length
        ) {
          yield browser.storage.sync.set({
            [domain]: fontData,
          });
        }
        // if global is checked, save to global_fonts
        // don't if the site has been exempted
        const exempts_list = yield browser.storage.sync.get(["exempts"]);
        if (
          "exempts" in exempts_list &&
          exempts_list["exempts"].includes(domain)
        ) {
          console.log(
            "This site has been exempted, so don't change the global fonts"
          );
        } else {
          const result = yield browser.storage.sync.get(["global"]);
          if ("global" in result && result["global"])
            yield browser.storage.sync.set({
              global_fonts: fontData,
            });
        }
      })
    );
  } catch (e) {
    console.error("Error applying or saving font.");
    console.error(e);
  }
});
globalFontSelectionForm.addEventListener("submit", (e) =>
  __awaiter(this, void 0, void 0, function* () {
    e.preventDefault();
    const globalSerifValue = globalSerifSelect.value;
    const globalSansSerifValue = globalSansSerifSelect.value;
    const globaMonospaceValue = globalMonospaceSelect.value;
    const applyButton = document.getElementById("global-apply-btn");
    if (
      !globalSerifValue.length &&
      !globalSansSerifValue.length &&
      !globaMonospaceValue.length
    )
      applyButton.innerHTML = "No Changes Made";
    else {
      applyButton.textContent = "Global fonts modified";
    }
    setTimeout(() => {
      applyButton.innerHTML = "🌐 Apply to all sites";
    }, 1500);
    yield browser.storage.sync.set({
      global_fonts: {
        serif: globalSerifValue.length ? globalSerifValue : "Default",
        sans_serif: globalSansSerifValue.length
          ? globalSansSerifValue
          : "Default",
        monospace: globaMonospaceValue.length ? globaMonospaceValue : "Default",
      },
    });
  })
);
restoreButton.addEventListener("click", () =>
  __awaiter(this, void 0, void 0, function* () {
    const result = yield browser.storage.sync.get(["global"]);
    const domain = yield getDomain();
    if ("global" in result && result["global"]) {
      const is_exempted = yield browser.storage.sync.get(["exempts"]);
      if ("exempts" in is_exempted && is_exempted["exempts"].includes(domain)) {
        // Only change for the site
        // Show refresh suggesion modal
        document.getElementById("restore_modal").showModal();
        browser.storage.sync.remove(domain);
        restoreButton.remove();
      } else {
        document.getElementById("warning_modal").showModal();
        yield browser.storage.sync.set({
          global: false,
        });
        globalCheck.checked = false;
        showTip(tipText);
      }
    }
    updatePlaceholders({
      serif: "Default",
      sans_serif: "Default",
      monospace: "Default",
    });
    document.getElementById("restore_modal").showModal();
    browser.storage.sync.remove(yield getDomain());
    restoreButton.remove();
  })
);
