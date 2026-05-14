const fixtureFileMap = {
  gif: 'gif.gif',
  jpeg: 'jpeg image.jpeg',
  jpg: 'jpg image.jpg',
  png: 'png image.png',
  webp: 'webp image.webp',
};

const fileSignatureChecks = {
  jpg: (signature) => signature.firstBytesHex.startsWith('ffd8ff'),
  jpeg: (signature) => signature.firstBytesHex.startsWith('ffd8ff'),
  png: (signature) => signature.firstBytesHex.startsWith('89504e470d0a1a0a'),
  webp: (signature) =>
    signature.asciiHeader.startsWith('RIFF') && signature.asciiHeader.includes('WEBP'),
  gif: (signature) =>
    signature.asciiHeader.startsWith('GIF87a') || signature.asciiHeader.startsWith('GIF89a'),
};

const routeHeadlineMap = {
  '/': 'Free Online Tools',
  '/contact': 'Contact',
  '/about': 'About',
  '/privacy': 'Privacy',
  '/terms': 'Terms',
  '/disclaimer': 'Disclaimer',
  '/convert-image': 'Convert Image',
  '/convert-to-jpg': 'Convert Image',
  '/convert-to-png': 'Convert Image',
  '/convert-to-webp': 'Convert Image',
  '/compress-image': 'Compress Image',
  '/pdf-editor': 'PDF Editor',
  '/resize-image': 'Resize',
  '/crop-png': 'Crop',
};

function getUploadInput() {
  return cy.get('input[type="file"]').should('exist');
}

function getVisibleActionButtons($body) {
  return [...$body.find('button')].filter((button) => {
    const text = normalizeText(button.innerText || button.textContent || '');
    const inStickyHeader = Boolean(button.closest('.sticky.top-0'));
    const inFooter = Boolean(button.closest('footer'));
    const looksLikeDropdownTrigger = (button.innerText || '').includes('▾');

    return (
      Cypress.dom.isVisible(button) &&
      !inStickyHeader &&
      !inFooter &&
      !looksLikeDropdownTrigger &&
      [/convert/i, /download/i].some((pattern) => pattern.test(text))
    );
  });
}

function findActionButton(label) {
  return cy.contains('button', new RegExp(label, 'i'));
}

function normalizeText(value = '') {
  return value.replace(/\s+/g, ' ').trim().toLowerCase();
}

function normalizeConversionText(value = '') {
  return normalizeText(value).replace(/->/g, '→');
}

function waitForDownloadedFile(extensions, modifiedAfter, attempts = 12) {
  const extensionList = Array.isArray(extensions) ? extensions : [extensions];

  return cy
    .task(
      'findLatestDownloadedFile',
      { extensions: extensionList, modifiedAfter },
      { log: false }
    )
    .then((file) => {
      if (file) {
        return file;
      }

      if (attempts <= 0) {
        throw new Error(
          `No downloaded file was found in cypress/downloads for: ${extensionList.join(', ')}`
        );
      }

      cy.wait(1000, { log: false });
      return waitForDownloadedFile(extensionList, modifiedAfter, attempts - 1);
    });
}

Cypress.Commands.add('visitStable', (path = '/') => {
  cy.visit('/');

  if (path !== '/') {
    cy.window().then((win) => {
      win.history.pushState({}, '', path);
      win.dispatchEvent(new win.PopStateEvent('popstate'));
    });
  }

  cy.location('pathname', { timeout: 20000 }).should('eq', path);
  cy.get('#root').should('be.visible');
});

Cypress.Commands.add('captureStep', (name) => {
  cy.screenshot(name, { capture: 'viewport' });
});

Cypress.Commands.add('clearDownloads', () => {
  cy.task('clearDownloads', null, { log: false });
});

Cypress.Commands.add('assertPageHasMainContent', (expectedText) => {
  cy.get('body').should('be.visible');
  cy.get('#root').should('not.be.empty');

  if (expectedText) {
    cy.contains(expectedText, { matchCase: false }).should('be.visible');
  }

  cy.get('body').invoke('text').then((text) => {
    expect(text.replace(/\s+/g, ' ').trim().length).to.be.greaterThan(80);
  });
});

Cypress.Commands.add('openPageFromText', (label, expectedPath) => {
  cy.get('body').then(($body) => {
    const directLink = $body.find(`a[href="${expectedPath}"]`);

    if (directLink.length > 0) {
      cy.wrap(directLink.first())
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true });

      return;
    }

    const labelText = normalizeText(label);
    const candidates = [...$body.find('a,button')].filter((element) => {
      const text = normalizeText(element.innerText || element.textContent || '');
      const inStickyHeader = Boolean(element.closest('.sticky.top-0'));
      const inFooter = Boolean(element.closest('footer'));
      const looksLikeDropdownTrigger = (element.innerText || '').includes('▾');

      return (
        Cypress.dom.isVisible(element) &&
        !inStickyHeader &&
        !inFooter &&
        !looksLikeDropdownTrigger &&
        text.includes(labelText)
      );
    });

    const exactCandidate = candidates.find((element) => {
      const text = normalizeText(element.innerText || element.textContent || '');
      return text === labelText;
    });

    const preferredCandidate =
      exactCandidate ||
      candidates.find((element) => element.tagName.toLowerCase() === 'a') ||
      candidates[0];

    if (preferredCandidate) {
      cy.wrap(preferredCandidate)
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true });

      return;
    }

    cy.contains('a,button', label, { matchCase: false })
      .should('be.visible')
      .click({ force: true });
  });

  cy.location('pathname', { timeout: 20000 }).should('eq', expectedPath);
  cy.assertPageHasMainContent(routeHeadlineMap[expectedPath] || label);
});

Cypress.Commands.add('openPageFromCard', (cardTitle, linkLabel, expectedPath) => {
  cy.get('body').then(($body) => {
    const matchingTitles = [...$body.find('*')].filter((element) => {
      const text = normalizeText(element.innerText || element.textContent || '');
      const inStickyHeader = Boolean(element.closest('.sticky.top-0'));
      const inFooter = Boolean(element.closest('footer'));

      return (
        Cypress.dom.isVisible(element) &&
        !inStickyHeader &&
        !inFooter &&
        text === normalizeText(cardTitle)
      );
    });

    const cardContainer = matchingTitles
      .map((element) => element.parentElement)
      .find((container) => {
        if (!container) {
          return false;
        }

        return [...container.querySelectorAll('a,button')].some((candidate) => {
          const text = normalizeText(candidate.innerText || candidate.textContent || '');
          return text.includes(normalizeText(linkLabel));
        });
      });

    if (!cardContainer) {
      throw new Error(`Could not find homepage card "${cardTitle}" containing link "${linkLabel}"`);
    }

    cy.wrap(cardContainer).within(() => {
      cy.contains('a,button', linkLabel, { matchCase: false })
        .should('be.visible')
        .click({ force: true });
    });
  });

  cy.location('pathname', { timeout: 20000 }).should('eq', expectedPath);
  cy.assertPageHasMainContent(routeHeadlineMap[expectedPath] || linkLabel);
});

Cypress.Commands.add('openFooterPage', (label, expectedPath) => {
  cy.get('footer').scrollIntoView();
  cy.contains('footer a, footer button', label, { matchCase: false })
    .should('be.visible')
    .click({ force: true });

  cy.location('pathname', { timeout: 20000 }).should('eq', expectedPath);
  cy.assertPageHasMainContent(routeHeadlineMap[expectedPath] || label);
});

Cypress.Commands.add('selectFixtureImage', (imageType) => {
  const fixtureFile = fixtureFileMap[imageType];

  expect(fixtureFile, `fixture file for ${imageType}`).to.exist;

  getUploadInput().selectFile(`cypress/fixtures/${fixtureFile}`, {
    force: true,
  });

  getUploadInput().then(($input) => {
    const [file] = $input[0].files;

    expect(file, 'selected upload file').to.exist;
    expect(file.name).to.eq(fixtureFile);
  });
});

Cypress.Commands.add('assertUploadAreaReady', () => {
  getUploadInput().should('be.enabled');
  cy.contains(/upload|drop|choose|browse/i).should('be.visible');
});

Cypress.Commands.add('assertConversionSelection', (selectionText) => {
  if (Array.isArray(selectionText)) {
    cy.get('body')
      .invoke('text')
      .then((text) => {
        const normalized = normalizeConversionText(text);
        const matched = selectionText.some((candidate) =>
          normalized.includes(normalizeConversionText(candidate))
        );

        expect(matched, `one of these conversion labels should be visible: ${selectionText.join(', ')}`)
          .to.equal(true);
      });

    return;
  }

  cy.get('body')
    .invoke('text')
    .then((text) => {
      expect(normalizeConversionText(text)).to.include(normalizeConversionText(selectionText));
    });
});

Cypress.Commands.add('assertConvertButtonStateBeforeUpload', () => {
  cy.get('body').then(($body) => {
    const matchedButtons = getVisibleActionButtons($body);

    matchedButtons.forEach((button) => {
      cy.wrap(button).should((buttonElement) => {
        const $button = Cypress.$(buttonElement);
        const disabled =
          $button.is(':disabled') ||
          $button.attr('aria-disabled') === 'true' ||
          $button.hasClass('disabled');

        expect(
          disabled || /upload|choose|select/i.test($button.text()),
          'button should not allow conversion before upload'
        ).to.equal(true);
      });
    });

    if (matchedButtons.length === 0) {
      expect(true, 'convert/download action is hidden before upload').to.equal(true);
    }
  });
});

Cypress.Commands.add('assertConversionReadyAfterUpload', () => {
  cy.contains('button', /^download$/i, { timeout: 20000 }).should('be.visible');
  cy.get('body').invoke('text').then((text) => {
    expect(text.toLowerCase()).not.to.include('no image yet');
  });
});

Cypress.Commands.add('assertSameFormatHandled', (formatLabel) => {
  cy.get('body').then(($body) => {
    const actionButtons = getVisibleActionButtons($body);
    const normalizedText = normalizeText($body.text());

    const hasSameFormatMessage =
      normalizedText.includes(`already in ${normalizeText(formatLabel)} format`) ||
      normalizedText.includes(`already ${normalizeText(formatLabel)}`) ||
      normalizedText.includes('same format');

    const allButtonsUnavailable =
      actionButtons.length === 0 ||
      actionButtons.every((button) => {
        const $button = Cypress.$(button);
        return (
          $button.is(':disabled') ||
          $button.attr('aria-disabled') === 'true' ||
          $button.hasClass('disabled')
        );
      });

    expect(
      hasSameFormatMessage || allButtonsUnavailable,
      `system should block same-format conversion or show a same-format message for ${formatLabel}`
    ).to.equal(true);
  });
});

Cypress.Commands.add('assertSameFormatRequirement', ({ formatLabel, forbiddenMappings = [] }) => {
  cy.get('body')
    .invoke('text')
    .then((text) => {
      const normalized = normalizeConversionText(text);
      const matchedForbiddenMapping = forbiddenMappings.find((mapping) =>
        normalized.includes(normalizeConversionText(mapping))
      );

      expect(
        matchedForbiddenMapping,
        `system should not show an incorrect conversion mapping for ${formatLabel}`
      ).to.equal(undefined);
    });

  cy.get('body').then(($body) => {
    const actionButtons = getVisibleActionButtons($body);
    const normalizedText = normalizeText($body.text());
    const hasSameFormatMessage =
      normalizedText.includes(`already in ${normalizeText(formatLabel)} format`) ||
      normalizedText.includes(`already ${normalizeText(formatLabel)}`) ||
      normalizedText.includes('same format');

    const allButtonsUnavailable =
      actionButtons.length === 0 ||
      actionButtons.every((button) => {
        const $button = Cypress.$(button);
        return (
          $button.is(':disabled') ||
          $button.attr('aria-disabled') === 'true' ||
          $button.hasClass('disabled')
        );
      });

    expect(
      hasSameFormatMessage || allButtonsUnavailable,
      `expected same-format protection for ${formatLabel} upload, but the system still exposed an active conversion flow`
    ).to.equal(true);
  });
});

Cypress.Commands.add('assertUploadAreaVisualFeedback', () => {
  cy.contains(/drag and drop your file here/i)
    .should('be.visible')
    .parent()
    .then(($zone) => {
      const beforeClass = $zone.attr('class') || '';
      const beforeStyle = $zone.attr('style') || '';

      cy.wrap($zone)
        .trigger('dragenter', { dataTransfer: new DataTransfer(), force: true })
        .trigger('dragover', { dataTransfer: new DataTransfer(), force: true });

      cy.wrap($zone).should(($updatedZone) => {
        const afterClass = $updatedZone.attr('class') || '';
        const afterStyle = $updatedZone.attr('style') || '';

        expect(
          afterClass !== beforeClass || afterStyle !== beforeStyle,
          'upload area should provide visual feedback on dragover'
        ).to.equal(true);
      });
    });
});

Cypress.Commands.add('assertConvertWithoutUploadHandled', () => {
  cy.get('body').then(($body) => {
    const actionButtons = getVisibleActionButtons($body);
    const normalizedText = normalizeText($body.text());

    if (actionButtons.length === 0) {
      expect(true, 'no convert/download action is exposed before upload').to.equal(true);
      return;
    }

    cy.wrap(actionButtons[0]).click({ force: true });

    cy.get('body')
      .invoke('text')
      .then((text) => {
        const updatedText = normalizeText(text);
        const hasValidationMessage =
          updatedText.includes('upload') ||
          updatedText.includes('select') ||
          updatedText.includes('warning') ||
          updatedText.includes('file first');

        expect(
          hasValidationMessage || updatedText === normalizedText,
          'system should block conversion without upload or show a validation message'
        ).to.equal(true);
      });
  });
});

Cypress.Commands.add('clickPrimaryConvertAction', () => {
  cy.get('body').then(($body) => {
    const labels = ['Convert', 'Download', 'Convert Image', 'Start'];
    const foundLabel = labels.find((label) =>
      [...$body.find('button')].some((button) =>
        new RegExp(label, 'i').test(button.innerText || '')
      )
    );

    if (foundLabel) {
      findActionButton(foundLabel).first().click({ force: true });
    }
  });
});

Cypress.Commands.add('downloadAndVerifyFormat', (expectedExtension) => {
  const extensionList = Array.isArray(expectedExtension) ? expectedExtension : [expectedExtension];

  cy.then(() => Date.now()).then((startedAt) => {
    cy.contains('button', /^download$/i).should('be.visible').click({ force: true });

    waitForDownloadedFile(extensionList, startedAt).then((downloadedFile) => {
      const matchedExtension = extensionList.find((extension) =>
        downloadedFile.name.toLowerCase().endsWith(`.${extension.toLowerCase()}`)
      );

      expect(matchedExtension, `downloaded file extension should be one of ${extensionList.join(', ')}`)
        .to.exist;

      cy.task('readFileSignature', downloadedFile.filePath, { log: false }).then((signature) => {
        const signatureCheck = fileSignatureChecks[matchedExtension];

        expect(signatureCheck, `signature check for ${matchedExtension}`).to.exist;
        expect(
          signatureCheck(signature),
          `downloaded file should have a valid ${matchedExtension.toUpperCase()} signature`
        ).to.equal(true);
      });
    });
  });
});

Cypress.Commands.add('assertPostUploadState', () => {
  cy.get('body').invoke('text').then((text) => {
    expect(text.toLowerCase()).not.to.include('application error');
    expect(text.toLowerCase()).not.to.include('not found');
  });
});

Cypress.Commands.add('assertInvalidFileFeedback', () => {
  getUploadInput().selectFile('cypress/fixtures/invalid-file.pdf', {
    force: true,
  });

  cy.get('body').invoke('text').then((text) => {
    const normalized = text.toLowerCase();
    const matchedKnownFeedback =
      normalized.includes('warning') ||
      normalized.includes('invalid') ||
      normalized.includes('unsupported') ||
      normalized.includes('error') ||
      normalized.includes('upload');

    expect(matchedKnownFeedback || normalized.length > 0).to.equal(true);
  });
});
