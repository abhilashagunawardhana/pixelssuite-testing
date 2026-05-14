describe('PixelSuite - Navigation and Tool Page Coverage', () => {
  beforeEach(() => {
    cy.visitStable('/');
  });

  it('PS-NAV-001 verifies key feature cards and buttons open the correct pages', () => {
    const homepageLinks = [
      ['Document Converter', 'Image → PDF', '/image-to-pdf'],
      ['Document Converter', 'PDF → Word', '/pdf-to-word'],
      ['Document Converter', 'Word → PDF', '/word-to-pdf'],
      ['PDF Editor', 'Open Editor', '/pdf-editor'],
      ['Resize', 'Resize', '/resize-image'],
      ['Compress', 'Compress Image', '/compress-image'],
      ['Image Converter', 'To JPG', '/convert-to-jpg'],
      ['Image Converter', 'To PNG', '/convert-to-png'],
      ['Image Converter', 'To WebP', '/convert-to-webp'],
      ['More Tools', 'Rotate', '/rotate-image'],
      ['More Tools', 'Flip', '/flip-image'],
      ['More Tools', 'Color Picker', '/color-picker'],
      ['More Tools', 'Image → Text', '/image-to-text'],
    ];

    homepageLinks.forEach(([cardTitle, linkLabel, expectedPath]) => {
      cy.visitStable('/');
      cy.openPageFromCard(cardTitle, linkLabel, expectedPath);
      cy.captureStep(`nav-${expectedPath.replace(/\//g, '-')}`);
    });
  });

  it('PS-NAV-002 verifies the Contact link works from the homepage', () => {
    cy.openFooterPage('Contact', '/contact');
    cy.contains(/contact/i).should('be.visible');
  });

  it('PS-NAV-003 verifies important direct routes open successfully with visible content', () => {
    const directRoutes = [
      ['/convert-image', 'Convert Image'],
      ['/convert-to-jpg', 'Convert Image'],
      ['/convert-to-png', 'Convert Image'],
      ['/convert-to-webp', 'Convert Image'],
      ['/compress-image', 'Compress Image'],
      ['/pdf-editor', 'PDF Editor'],
      ['/resize-image', 'Resize'],
      ['/crop-png', 'Crop'],
      ['/contact', 'Contact'],
      ['/about', 'About'],
      ['/privacy', 'Privacy'],
      ['/terms', 'Terms'],
      ['/disclaimer', 'Disclaimer'],
    ];

    directRoutes.forEach(([path, marker]) => {
      cy.visitStable(path);
      cy.assertPageHasMainContent(marker);
    });
  });

  it('PS-NAV-004 verifies pages do not show broken or empty content after navigation', () => {
    const smokeRoutes = [
      '/',
      '/contact',
      '/about',
      '/privacy',
      '/convert-image',
      '/convert-to-jpg',
      '/convert-to-png',
      '/convert-to-webp',
    ];

    smokeRoutes.forEach((path) => {
      cy.visitStable(path);
      cy.get('body').invoke('text').then((text) => {
        const normalized = text.toLowerCase();

        expect(normalized).not.to.include('404');
        expect(normalized).not.to.include('page not found');
        expect(normalized).not.to.include('unexpected application error');
        expect(normalized.replace(/\s+/g, ' ').trim().length).to.be.greaterThan(80);
      });
    });
  });
});
