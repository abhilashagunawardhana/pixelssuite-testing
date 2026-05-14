describe('PixelSuite - General System Coverage on Homepage', () => {
  beforeEach(() => {
    cy.visitStable('/');
  });

  it('PS-GEN-001 verifies the homepage loads successfully', () => {
    cy.title().should('contain', 'PixelsSuite');
    cy.assertPageHasMainContent('Free Online Tools');
    cy.captureStep('homepage-loaded');
  });

  it('PS-GEN-002 verifies hero content and important sections are visible', () => {
    cy.contains('Free Online Tools', { matchCase: false }).should('be.visible');
    cy.contains('Document Converter').should('be.visible');
    cy.contains('PDF Editor').should('be.visible');
    cy.contains('Resize').should('be.visible');
    cy.contains('Crop').should('be.visible');
    cy.contains('Compress').should('be.visible');
    cy.contains('Image Converter').should('be.visible');
    cy.contains('More Tools').should('be.visible');
  });

  it('PS-GEN-003 verifies navigation menu items are visible, excluding Transliteration from test scope', () => {
    [
      'Document Converter',
      'Editor',
      'Resize',
      'Crop',
      'Compress',
      'Image Converter',
      'More',
    ].forEach((label) => {
      cy.contains('button,a', label, { matchCase: false }).should('be.visible');
    });
  });

  it('PS-GEN-004 verifies footer links are clickable and pages show non-empty content', () => {
    const footerPages = [
      ['About Us', '/about'],
      ['Contact', '/contact'],
      ['Privacy Policy', '/privacy'],
      ['Terms of Service', '/terms'],
      ['Disclaimer', '/disclaimer'],
    ];

    footerPages.forEach(([label, path]) => {
      cy.visitStable('/');
      cy.openFooterPage(label, path);
      cy.captureStep(`footer-${path.replace('/', '') || 'home'}`);
    });
  });
});
