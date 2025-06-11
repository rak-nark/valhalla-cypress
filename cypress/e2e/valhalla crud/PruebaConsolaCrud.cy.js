describe('Panel de Administración - Consolas', () => {
    beforeEach(() => {
        // Ignora errores uncaught de la app (como Swal is not defined)
        cy.on('uncaught:exception', (err, runnable) => {
            // Ignora todos los errores uncaught
            return false;
        });
        cy.visit('http://74.235.100.236:8080');
        cy.get('input[name="correoCliente"]').type('juanitoalimana@gmail.com');
        cy.get('input[name="contrasenaCliente"]').type('123456789');
        cy.get('input[name="Ingresar"]').click();
        // Navega a la vista de Consolas usando el navbar
        cy.get('a.nav-link').contains('Consolas').click();
        cy.url().should('include', '/consola.php');
        cy.contains('Consolas').should('exist');
    });

    it('Debe permitir editar el estado de una consola', () => {
        // Busca la consola por tipo (ajusta el texto según tu dato real)
        cy.get('table').contains('td', '360').parents('tr').within(() => {
            cy.get('button.btn-warning').click();
        });
        // Cambia el estado en el modal
        cy.get('.modal.show select[name="estado"]').select('no_disponible');
        cy.get('.modal.show button[type="submit"]').contains('Guardar').click();

        // Espera y vuelve a la ruta de consolas para verificar el cambio
        cy.wait(1000);
        cy.visit('http://74.235.100.236:8080/consola.php');

        // Verifica que el estado cambió
        cy.get('table').contains('td', '360').parents('tr').within(() => {
            cy.get('td').contains(/No Disponible|no disponible/i);
        });
    });
})