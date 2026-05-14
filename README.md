# PixelSuite Cypress Automated Testing Suite

A comprehensive end-to-end testing suite built with Cypress for testing [PixelSuite](https://www.pixelssuite.com), a free online tools application offering image conversion, document conversion, PDF editing, resizing, cropping, and compression utilities.

## 📋 Project Overview

This project contains automated test cases covering three main functional areas:

- **General System Coverage**: Homepage functionality, navigation menu visibility, and footer links
- **Navigation Testing**: Feature cards, buttons, direct routes, and page content validation
- **Image Converter Testing**: Upload flows, file format conversions (PNG ↔ JPG ↔ WebP), and invalid file handling

## 🏗️ Project Structure

```
pixelssuite-testing/
├── cypress.config.js           # Cypress configuration with custom tasks
├── package.json                # Project dependencies and scripts
├── cypress/
│   ├── e2e/                   # End-to-end test specifications
│   │   ├── system/            # General and navigation tests
│   │   │   ├── homepage.cy.js
│   │   │   └── navigation.cy.js
│   │   └── image-converter/   # Image converter feature tests
│   │       └── image-converter.cy.js
│   ├── fixtures/              # Test data and fixtures
│   │   └── invalid-file.txt
│   ├── support/               # Custom commands and configuration
│   │   ├── commands.js        # Reusable test utilities
│   │   └── e2e.js            # Global test setup
│   ├── screenshots/           # Screenshots on test failure
│   ├── downloads/             # Downloaded files during tests
│   └── videos/                # Test execution recordings (optional)
└── docs/
    └── automated-test-cases.md # Detailed test case documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pixelssuite-testing.git
cd pixelssuite-testing
```

2. Install dependencies:
```bash
npm install
```

## 📊 Test Cases

The suite includes **19 automated test cases** across three functional areas:

### General System Coverage (PS-GEN)
- PS-GEN-001: Homepage loads successfully
- PS-GEN-002: Hero section and key sections are visible
- PS-GEN-003: Navigation menu items are visible
- PS-GEN-004: Footer links open valid pages

### Navigation Testing (PS-NAV)
- PS-NAV-001: Feature cards and buttons navigate correctly
- PS-NAV-002: Contact page/link works
- PS-NAV-003: Direct routes open successfully
- PS-NAV-004: Pages show non-empty content after navigation

### Image Converter (PS-IMG)
- PS-IMG-001 to PS-IMG-009: Comprehensive image conversion and upload scenarios
  - PNG to JPG, JPEG to PNG, JPEG to WebP conversions
  - Same-format upload behavior (PNG to PNG, etc.)
  - Upload area functionality and invalid file handling

For detailed test case specifications, see [docs/automated-test-cases.md](docs/automated-test-cases.md).

## 🎮 Running Tests

### Interactive Mode
Open the Cypress Test Runner:
```bash
npm run cy:open
```

### Headless Mode (All Tests)
```bash
npm run cy:run
# or
npm test
```

### Run Specific Test Suites
```bash
# General & Navigation tests only
npm run cy:run:general

# Image Converter tests only
npm run cy:run:image
```

## ⚙️ Configuration

Key Cypress configuration settings in `cypress.config.js`:

| Setting | Value | Purpose |
|---------|-------|---------|
| Base URL | https://www.pixelssuite.com | Target application |
| Viewport | 1440x900 | Desktop test resolution |
| Default Timeout | 12 seconds | Command timeout |
| Page Load Timeout | 45 seconds | Page load timeout |
| Screenshot on Failure | Enabled | Capture failures |
| Video Recording | Disabled | (Can be enabled) |
| Retries (Run Mode) | 1 | Retry failed tests once |

## 🛠️ Custom Commands & Tasks

The suite includes custom Cypress commands for improved test readability:

- `cy.visitStable()`: Stable page navigation with retry logic
- `cy.assertPageHasMainContent()`: Content visibility assertions
- `cy.openFooterPage()`: Footer link navigation
- `cy.uploadImage()`: Image file upload with in-memory fixtures
- `cy.captureStep()`: Screenshot capture with descriptive naming

### Custom Cypress Tasks

- `clearDownloads()`: Clean the downloads folder
- `findLatestDownloadedFile()`: Find recently downloaded files by extension
- `readFileSignature()`: Read file headers for validation

## 📝 Fixtures & Test Data

- The suite uses **in-memory image files** embedded in `cypress/support/commands.js`
- Invalid file fixture: `cypress/fixtures/invalid-file.txt` (for negative test cases)
- Optional: Replace embedded files with fixture-based approach if binary fixtures are added

## 📸 Screenshots & Videos

- Test failure screenshots are automatically captured in `cypress/screenshots/`
- Video recordings can be enabled in `cypress.config.js`
- Downloaded files during image converter tests are saved to `cypress/downloads/`

## 🔍 Selector Strategy

The suite primarily uses **text-based selectors** because the PixelSuite application doesn't expose dedicated `data-*` test attributes. If tests become flaky:

1. Inspect elements in the browser DevTools
2. Verify selectors still match (UI may have changed)
3. Consider requesting `data-cy` attributes be added to the application

## 🤝 Contributing

1. Follow the existing test structure and naming conventions
2. Add new tests to the appropriate suite (system, navigation, or image-converter)
3. Update [docs/automated-test-cases.md](docs/automated-test-cases.md) with new test IDs
4. Ensure all tests pass before submitting

## 📋 Test Naming Convention

Test IDs follow this pattern: `PS-[AREA]-[NUMBER]`

- **Area**: GEN (General), NAV (Navigation), IMG (Image)
- **Number**: Sequential 001, 002, etc.

Example: `PS-GEN-001` = First general system test

## ⚠️ Known Considerations

- The suite disables `chromeWebSecurity` in Cypress configuration to handle PixelSuite's public deployment
- Global error handler suppresses unrelated client errors to ensure test stability
- Some selectors depend on specific UI text; if the application UI changes significantly, selectors may need updating

## 📚 Documentation

- Detailed test case specifications: [docs/automated-test-cases.md](docs/automated-test-cases.md)
- Cypress documentation: https://docs.cypress.io
- PixelSuite application: https://www.pixelssuite.com

## 📄 License

ISC

## 👤 Author

Abhilasha Gunawardhana

---

**Last Updated**: May 2026
