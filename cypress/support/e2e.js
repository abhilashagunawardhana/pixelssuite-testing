require('./commands');

Cypress.on('uncaught:exception', () => {
  // The site is a public production SPA; this keeps unrelated client errors
  // from failing academic demonstration runs unless they affect assertions.
  return false;
});
