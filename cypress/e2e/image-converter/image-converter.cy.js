describe('PixelSuite - Image Converter Requirement-Based Scenarios', () => {
  beforeEach(() => {
    cy.viewport(1440, 900);
  });

  it('TC_F01 uploads a PNG and converts it to JPG', () => {
    cy.clearDownloads();
    cy.visitStable('/convert-to-jpg');
    cy.assertPageHasMainContent('Convert Image');
    cy.assertUploadAreaReady();
    cy.assertConvertButtonStateBeforeUpload();

    cy.selectFixtureImage('png');
    cy.assertConversionReadyAfterUpload();
    cy.get('input[type="file"]').should(($input) => {
      expect($input[0].files[0].name).to.eq('png image.png');
    });

    cy.assertConversionSelection(['PNG → JPG', 'PNG → JPEG', 'PNG -> JPG', 'PNG -> JPEG']);
    cy.downloadAndVerifyFormat(['jpg', 'jpeg']);
  });

  it('TC_F02 uploads a JPG to the To JPG function and should be prevented or warned', () => {
    cy.visitStable('/convert-to-jpg');
    cy.assertPageHasMainContent('Convert Image');
    cy.assertUploadAreaReady();

    cy.selectFixtureImage('jpg');
    cy.get('input[type="file"]').should(($input) => {
      expect($input[0].files[0].name).to.eq('jpg image.jpg');
    });

    cy.assertSameFormatRequirement({
      formatLabel: 'JPG',
      forbiddenMappings: ['JPG → PNG', 'JPEG → PNG', 'JPG -> PNG', 'JPEG -> PNG'],
    });
  });

  it('TC_F03 uploads a JPG and converts it to PNG', () => {
    cy.clearDownloads();
    cy.visitStable('/convert-to-png');
    cy.assertPageHasMainContent('Convert Image');
    cy.assertUploadAreaReady();
    cy.assertConvertButtonStateBeforeUpload();

    cy.selectFixtureImage('jpg');
    cy.assertConversionReadyAfterUpload();
    cy.get('input[type="file"]').should(($input) => {
      expect($input[0].files[0].name).to.eq('jpg image.jpg');
    });

    cy.assertConversionSelection(['JPG → PNG', 'JPEG → PNG', 'JPG -> PNG', 'JPEG -> PNG']);
    cy.downloadAndVerifyFormat('png');
  });

  it('TC_F04 uploads a PNG to the To PNG function and should be prevented or warned', () => {
    cy.visitStable('/convert-to-png');
    cy.assertPageHasMainContent('Convert Image');
    cy.assertUploadAreaReady();

    cy.selectFixtureImage('png');
    cy.get('input[type="file"]').should(($input) => {
      expect($input[0].files[0].name).to.eq('png image.png');
    });

    cy.assertSameFormatRequirement({
      formatLabel: 'PNG',
      forbiddenMappings: ['PNG → JPG', 'PNG -> JPG', 'PNG → JPEG', 'PNG -> JPEG'],
    });
  });

  it('TC_F05 uploads a JPG and converts it to WebP', () => {
    cy.clearDownloads();
    cy.visitStable('/convert-to-webp');
    cy.assertPageHasMainContent('Convert Image');
    cy.assertUploadAreaReady();
    cy.assertConvertButtonStateBeforeUpload();

    cy.selectFixtureImage('jpg');
    cy.assertConversionReadyAfterUpload();
    cy.get('input[type="file"]').should(($input) => {
      expect($input[0].files[0].name).to.eq('jpg image.jpg');
    });

    cy.assertConversionSelection(['JPG → WEBP', 'JPEG → WEBP', 'JPG -> WEBP', 'JPEG -> WEBP']);
    cy.downloadAndVerifyFormat('webp');
  });

  it('TC_F06 uploads a WebP to the To WebP function and should be prevented or warned', () => {
    cy.visitStable('/convert-to-webp');
    cy.assertPageHasMainContent('Convert Image');
    cy.assertUploadAreaReady();

    cy.selectFixtureImage('webp');
    cy.get('input[type="file"]').should(($input) => {
      expect($input[0].files[0].name).to.eq('webp image.webp');
    });

    cy.assertSameFormatRequirement({
      formatLabel: 'WebP',
      forbiddenMappings: ['WEBP → PNG', 'WEBP -> PNG'],
    });
  });

  it('TC_U01 verifies the image converter page loads correctly', () => {
    cy.visitStable('/convert-image');
    cy.assertPageHasMainContent('Image Converter');
    cy.assertUploadAreaReady();
  });

  it('TC_U02 verifies drag-and-drop visual feedback on the upload area', () => {
    cy.visitStable('/convert-image');
    cy.assertPageHasMainContent('Image Converter');
    cy.assertUploadAreaVisualFeedback();
  });

  it('TC_U04 verifies the convert or download button remains disabled before upload', () => {
    cy.visitStable('/convert-image');
    cy.assertPageHasMainContent('Image Converter');
    cy.assertUploadAreaReady();
    cy.assertConvertButtonStateBeforeUpload();
  });

  it('TC_E02 rejects a non-image file upload', () => {
    cy.visitStable('/convert-image');
    cy.assertUploadAreaReady();
    cy.assertInvalidFileFeedback();
  });

  it('TC_E07 handles convert or download without an uploaded image', () => {
    cy.visitStable('/convert-image');
    cy.assertPageHasMainContent('Image Converter');
    cy.assertUploadAreaReady();
    cy.assertConvertWithoutUploadHandled();
  });
});
