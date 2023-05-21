const { join } = require("path");
const { writeFile } = require("fs");

const homeAssistantConstantsUrl =
  "https://raw.githubusercontent.com/home-assistant/frontend/dev/src/common/const.ts";

console.log("Pulling Home Assistant Frontend Constants from GitHub...");

fetch(homeAssistantConstantsUrl, { method: "GET" })
  .then((response) => {
    response.text().then((text) => {
      writeFile(
        join(__dirname, "../src/utils/homeAssistant/const.ts"),
        `// Sourced from ${homeAssistantConstantsUrl}\n\n${text}`,
        (error) => {
          if (error) {
            console.error(
              "Error writing Home Assistant Frontend Constants to file: " +
                error
            );
          } else {
            console.log(
              "Home Assistant Frontend Constants successfully pulled from GitHub!"
            );
          }
        }
      );
    });
  })
  .catch((error) => {
    console.error(
      "Error pulling Home Assistant Frontend Constants from GitHub: " + error
    );
  });
