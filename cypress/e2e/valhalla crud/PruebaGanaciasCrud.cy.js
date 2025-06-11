describe('Panel de Administración - Ganancias', () => {
    beforeEach(() => {
        // Inicia sesión y navega a Ganancias
        cy.visit('http://74.235.100.236:8080');
        cy.get('input[name="correoCliente"]').type('juanitoalimana@gmail.com');
        cy.get('input[name="contrasenaCliente"]').type('123456789');
        cy.get('input[name="Ingresar"]').click();
        cy.get('a.nav-link').contains('Ganancias').click();
        cy.url().should('include', '/ganancias.php');
        cy.contains('Consulta de Ganancias').should('exist');
    });

    it('Debe consultar las ganancias desde el 1 de enero hasta hoy', () => {
        // Selecciona las fechas
        const hoy = new Date();
        const yyyy = hoy.getFullYear();
        const mm = String(hoy.getMonth() + 1).padStart(2, '0');
        const dd = String(hoy.getDate()).padStart(2, '0');
        const fechaHoy = `${yyyy}-${mm}-${dd}`;
        const fechaInicio = `${yyyy}-01-01`;

        cy.get('input[name="fecha_inicio"]').clear().type(fechaInicio);
        cy.get('input[name="fecha_fin"]').clear().type(fechaHoy);
        cy.get('button[type="submit"]').contains('Consultar').click();

        // Verifica que se muestre el periodo correcto y algún monto
        cy.contains(`Desde ${fechaInicio} hasta ${fechaHoy}`).should('exist');
    });
});