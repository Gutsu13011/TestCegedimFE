describe('Appointments page', () => {
  before(() => {
    cy.visit('/appointments');
  });

  it('can see the intros sections', () => {
    cy.pick('instructions').should('be.visible');
    cy.pick('appointment-form').should('be.visible');
    cy.pick('appointment-list').should('be.visible');
  });

  it('can see the appointment Form and list, as well as 2 select Fields', () => {
    cy.pick('appointment-list').should('be.visible');
    cy.pick('appointment-form').should('be.visible');
    cy.pick('selectField-practitionerId').should('have.length', 1);
    cy.pick('selectField-patientId').should('have.length', 1);
    cy.pick('selectField-availabilityId').should('have.length', 0);
  });
});
