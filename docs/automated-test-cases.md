# PixelSuite Cypress Automated Test Cases

## Recommended Cypress Project Structure

```text
pixelssuite-testing/
|-- cypress.config.js
|-- package.json
|-- cypress/
|   |-- e2e/
|   |   |-- system/
|   |   |   |-- homepage.cy.js
|   |   |   `-- navigation.cy.js
|   |   `-- image-converter/
|   |       `-- image-converter.cy.js
|   |-- fixtures/
|   |   `-- invalid-file.txt
|   `-- support/
|       |-- commands.js
|       `-- e2e.js
`-- docs/
    `-- automated-test-cases.md
```

## Automated Test Cases

| Test ID | Area | Scenario |
|---|---|---|
| PS-GEN-001 | General | Verify homepage loads successfully |
| PS-GEN-002 | General | Verify hero section and key homepage sections are visible |
| PS-GEN-003 | General | Verify main navigation menu items are visible |
| PS-GEN-004 | General | Verify footer links open valid non-empty pages |
| PS-NAV-001 | Navigation | Verify homepage feature cards and buttons open the correct pages |
| PS-NAV-002 | Navigation | Verify Contact page/link works correctly |
| PS-NAV-003 | Navigation | Verify important direct routes open successfully |
| PS-NAV-004 | Navigation | Verify pages do not show broken or empty content after navigation |
| PS-IMG-001 | Image Converter | Upload PNG and use To JPG flow |
| PS-IMG-002 | Image Converter | Upload JPEG and use To PNG flow |
| PS-IMG-003 | Image Converter | Upload JPEG and use To WebP flow |
| PS-IMG-004 | Image Converter | Upload JPEG to To JPG and observe behavior |
| PS-IMG-005 | Image Converter | Upload PNG to To PNG and observe behavior |
| PS-IMG-006 | Image Converter | Upload WebP to To WebP and observe behavior |
| PS-IMG-007 | Image Converter | Verify convert or download action is not ready before upload |
| PS-IMG-008 | Image Converter | Verify upload area and file input work correctly |
| PS-IMG-009 | Image Converter | Verify invalid file handling with non-image upload |

## Fixture Usage Notes

- The suite uses embedded in-memory image files in `cypress/support/commands.js` so it can run even if the binary fixtures are not present yet.
- If you already have your real fixtures, you can replace the embedded upload command with direct fixture-based `selectFile()` calls for:
  - `cypress/fixtures/gif.gif`
  - `cypress/fixtures/jpeg image.jpeg`
  - `cypress/fixtures/png image.png`
  - `cypress/fixtures/image.webp`
- `cypress/fixtures/invalid-file.txt` is included for negative upload coverage.

## Academic Demonstration Points

- The suite is split by functional area for easier explanation during viva.
- `beforeEach()` is used where repeated setup improves readability.
- Assertions cover URL, visible content, clickable navigation, upload readiness, and non-empty page rendering.
- Transliteration is intentionally excluded from the scenarios and scripts.

## Selector Inspection Notes

- The current tests prefer text-based selectors because the public site does not expose dedicated `data-*` test hooks.
- If any spec becomes flaky, inspect these elements first in the browser:
  - Main menu dropdown triggers such as `Image Converter`, `Compress`, and `More`
  - Homepage cards such as `Open Editor`, `To JPG`, `To PNG`, and `To WebP`
  - The converter page upload input `input[type="file"]`
  - The main convert/download button text on each image converter page
- If the app UI changes, the safest improvement is to add `data-cy` attributes and switch the tests to those selectors.
