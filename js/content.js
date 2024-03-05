const setLink = (href, rel, isCrossOrigin) => {
    const link = document.createElement("link");
    link.href = href;
    link.rel = rel;
    if (isCrossOrigin) link.crossOrigin = "crossorigin";
    document.head.appendChild(link);
};

setLink("https://fonts.googleapis.com", "preconnect", false);
setLink("https://fonts.gstatic.com", "preconnect", true);

const googleFontsURL =
    "https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&family=Inter:wght@100..900&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Playfair:ital,opsz,wght@0,5..1200,300..900;1,5..1200,300..900&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&family=Vollkorn:ital,wght@0,400..900;1,400..900&display=swap";

setLink(googleFontsURL, "stylesheet", false);
const changeFontFamily = (node, serif, sansSerif, monospace) => {
    if (node.nodeType === 1) {
        const computedStyle = window.getComputedStyle(node);
        const fontFamily = computedStyle.getPropertyValue("font-family");
        if (fontFamily) {
            if (fontFamily.includes("sans-serif") && sansSerif != "Default") {
                node.style.fontFamily = `'${sansSerif}'`;
            } else if (fontFamily.includes("serif") && serif != "Default") {
                node.style.fontFamily = `'${serif}'`;
            } else if (
                fontFamily.includes("monospace") &&
                monospace != "Default"
            ) {
                node.style.fontFamily = `'${monospace}'`;
            }
        }
    }
    // Recursively process child nodes
    for (const childNode of node.childNodes) {
        changeFontFamily(childNode, serif, sansSerif, monospace);
    }
};
let message = {
    action: "on-page-load",
    domain: window.location.hostname,
};
// Tries to load font when page is loaded
browser.runtime.sendMessage(message, undefined, (response) => {
    if (response.type === "apply_font") {
        console.log("Loading fonts from storage");
        const serif = response.data.serif;
        const sans_serif = response.data.sans_serif;
        const monospace = response.data.monospace;
        changeFontFamily(document.body, serif, sans_serif, monospace);
    } else if (response.type === "none") {
        console.log("Font not set for site");
    }
});
// Listens for the popup buttons
browser.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((message) => {
        {
            if (message.type === "apply_font") {
                console.log("Request received from popup for applying fonts");
                const serif = message.data.serif;
                const sans_serif = message.data.sans_serif;
                const monospace = message.data.monospace;
                changeFontFamily(document.body, serif, sans_serif, monospace);
            } else if (message.type === "restore") {
                location.reload();
            } else if (message.type === "redirect") {
                window.open(message.data.redirect_url, "_blank");
            }
        }
    });
});
