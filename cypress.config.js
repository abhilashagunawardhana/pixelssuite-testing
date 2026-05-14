const fs = require('fs');
const path = require('path');
const { defineConfig } = require('cypress');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.pixelssuite.com',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    downloadsFolder: 'cypress/downloads',
    viewportWidth: 1440,
    viewportHeight: 900,
    defaultCommandTimeout: 12000,
    pageLoadTimeout: 45000,
    chromeWebSecurity: false,
    video: false,
    screenshotOnRunFailure: true,
    retries: {
      runMode: 1,
      openMode: 0,
    },
    setupNodeEvents(on, config) {
      const downloadsFolder = path.resolve(config.projectRoot, config.downloadsFolder);
      ensureDir(downloadsFolder);

      on('task', {
        clearDownloads() {
          ensureDir(downloadsFolder);

          for (const file of fs.readdirSync(downloadsFolder)) {
            fs.rmSync(path.join(downloadsFolder, file), {
              recursive: true,
              force: true,
            });
          }

          return null;
        },

        findLatestDownloadedFile({ extensions, modifiedAfter = 0 }) {
          ensureDir(downloadsFolder);
          const extensionList = Array.isArray(extensions) ? extensions : [extensions];

          const matchingFiles = fs
            .readdirSync(downloadsFolder)
            .map((name) => {
              const filePath = path.join(downloadsFolder, name);
              const stats = fs.statSync(filePath);

              return {
                name,
                filePath,
                mtimeMs: stats.mtimeMs,
                isFile: stats.isFile(),
              };
            })
            .filter((entry) => {
              return (
                entry.isFile &&
                entry.mtimeMs >= modifiedAfter &&
                extensionList.some((extension) =>
                  entry.name.toLowerCase().endsWith(`.${String(extension).toLowerCase()}`)
                )
              );
            })
            .sort((a, b) => b.mtimeMs - a.mtimeMs);

          return matchingFiles[0] || null;
        },

        readFileSignature(filePath) {
          const buffer = fs.readFileSync(filePath);
          const firstBytesHex = buffer.subarray(0, 16).toString('hex');
          const asciiHeader = buffer.subarray(0, 16).toString('ascii');

          return {
            filePath,
            firstBytesHex,
            asciiHeader,
          };
        },
      });

      return config;
    },
  },
});
