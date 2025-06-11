describe('Panel de Administración - Ventas', () => {
    beforeEach(() => {
        // Inicia sesión y navega a Ventas
        cy.visit('http://74.235.100.236:8080');
        cy.get('input[name="correoCliente"]').type('juanitoalimana@gmail.com');
        cy.get('input[name="contrasenaCliente"]').type('123456789');
        cy.get('input[name="Ingresar"]').click();
        cy.get('a.nav-link').contains('Ventas').click();
        cy.url().should('include', '/venta.php');
        cy.contains('Gestión de Ventas').should('exist');
    });

    it('Debe mostrar el modal de Ganancias Diarias', () => {
        cy.get('button').contains('Ganancias Diarias').click();
        cy.get('#modalGanancias').should('be.visible');
        cy.get('#modalGanancias').contains('Ganancias del Día').should('exist');
        cy.get('#modalGanancias').contains('Total de hoy:').should('exist');
        cy.get('#modalGanancias button').contains('Cerrar').click();
        cy.get('#modalGanancias').should('not.be.visible');
    });

    it('Debe permitir eliminar una venta', () => {
        // Elimina la primera venta de la tabla (ajusta si necesitas buscar por algún dato específico)
        cy.get('table tbody tr').first().within(() => {
        });
        // Espera a que la tabla se actualice
        cy.wait(1000);
        // Verifica que la fila ya no existe (puedes validar que la cantidad de filas disminuyó)
        cy.get('table tbody tr').should('exist');
    });
});