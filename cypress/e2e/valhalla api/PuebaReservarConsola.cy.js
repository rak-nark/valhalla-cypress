const hoy = new Date().toISOString().split('T')[0];

describe('Pruebas de Reservar Consola', () => {
    beforeEach(() => {
        cy.visit('/login');
        cy.get('input#correoCliente').type('marcanno@gmail.com');
        cy.get('input#contrasenaCliente').type('123456789');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/home');
        cy.contains('Reservar Consola').click();
        cy.url().should('include', '/reserva');
    });

    it('no permite reservar fuera de los días permitidos', () => {
        const ayer = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        cy.get('input#fecha').clear().type(ayer);
        cy.get('button[type="submit"]').click();
        cy.on('window:alert', (str) => {
            expect(str).to.contain('Las reservas solo pueden realizarse desde hoy hasta un máximo de dos días después');
        });
    });



    it('debe mostrar las 13 consolas en la lista', () => {
        cy.get('select[formcontrolname="id_consola"] option').should('have.length', 13);
        cy.get('select[formcontrolname="id_consola"]').contains('Xbox 360 8').should('exist');
        cy.get('select[formcontrolname="id_consola"]').contains('Xbox 360 1').should('exist');
    });

    it('debe mostrar solo los tiempos de uso permitidos', () => {
        const tiemposEsperados = [
            { label: '30 minutos', value: '30' },
            { label: '1 hora', value: '60' },
            { label: '1 hora 30 minutos', value: '90' },
            { label: '2 horas', value: '120' },
            { label: '3 horas', value: '180' }
        ];
        cy.get('select[formcontrolname="tiempodeuso"] option').should('have.length', tiemposEsperados.length);
        tiemposEsperados.forEach(({ label, value }) => {
            cy.get('select[formcontrolname="tiempodeuso"] option[value="' + value + '"]').should('contain.text', label);
        });
    });

    it('debe mostrar los intervalos de hora permitidos (10:00 a.m. a 8:00 p.m. cada 30 min)', () => {
        const horasEsperadas = [
            '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
            '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
            '18:00', '18:30', '19:00', '19:30', '20:00'
        ];
        cy.get('select[formcontrolname="hora"] option').then(options => {
            const valores = [...options].map(o => o.value);
            horasEsperadas.forEach(hora => {
                expect(valores).to.include(hora);
            });
        });
    });
    it('no permite reservar la misma consola a la misma hora', () => {
        cy.get('input#fecha').clear().type(hoy);
        cy.get('select[formcontrolname="hora"]').select('12:00');
        cy.get('select[formcontrolname="tiempodeuso"]').select('60');
        cy.get('select[formcontrolname="id_consola"]').select('Xbox 360 8');
        cy.get('button[type="submit"]').click();
        cy.on('window:alert', (str) => {
            expect(str).to.contain('¡Reserva exitosa!');
        });
        cy.visit('/reserva');
        cy.get('input#fecha').clear().type(hoy);
        cy.get('select[formcontrolname="hora"]').select('12:00');
        cy.get('select[formcontrolname="tiempodeuso"]').select('60');
        cy.get('select[formcontrolname="id_consola"]').select('Xbox 360 8');
        cy.get('button[type="submit"]').click();
        cy.on('window:alert', (str) => {
            expect(str).to.contain('La consola ya está reservada para esa hora');
        });
    });

    it('no permite tener más de 2 préstamos activos', () => {
        cy.get('input#fecha').clear().type(hoy);
        cy.get('select[formcontrolname="hora"]').select('13:00');
        cy.get('select[formcontrolname="tiempodeuso"]').select('60');
        cy.get('select[formcontrolname="id_consola"]').select('Xbox 360 2');
        cy.get('button[type="submit"]').click();
        cy.on('window:alert', (str) => {
            expect(str).to.contain('¡Reserva exitosa!');
        });
        cy.visit('/reserva');
        cy.get('input#fecha').clear().type(hoy);
        cy.get('select[formcontrolname="hora"]').select('14:00');
        cy.get('select[formcontrolname="tiempodeuso"]').select('60');
        cy.get('select[formcontrolname="id_consola"]').select('Xbox 360 3');
        cy.get('button[type="submit"]').click();
        cy.on('window:alert', (str) => {
            expect(str).to.contain('¡Reserva exitosa!');
        });
        cy.visit('/reserva');
        cy.get('input#fecha').clear().type(hoy);
        cy.get('select[formcontrolname="hora"]').select('15:00');
        cy.get('select[formcontrolname="tiempodeuso"]').select('60');
        cy.get('select[formcontrolname="id_consola"]').select('Xbox 360 4');
        cy.get('button[type="submit"]').click();
        cy.on('window:alert', (str) => {
            expect(str).to.contain('No puedes tener más de 2 préstamos activos');
        });
    });

    it('no permite reservar una consola no disponible', () => {
        cy.get('input#fecha').clear().type(hoy);
        cy.get('select[formcontrolname="hora"]').select('12:00');
        cy.get('select[formcontrolname="tiempodeuso"]').select('60');
        cy.get('select[formcontrolname="id_consola"]').select('Xbox 360 1');
        cy.get('button[type="submit"]').click();
        cy.on('window:alert', (str) => {
            expect(str).to.contain('La consola no está disponible');
        });
    });

    it('permite reservar correctamente una consola disponible', () => {
        cy.get('input#fecha').clear().type(hoy);
        cy.get('select[formcontrolname="hora"]').select('12:00');
        cy.get('select[formcontrolname="tiempodeuso"]').select('60');
        cy.get('select[formcontrolname="id_consola"]').select('Xbox 360 8');
        cy.get('button[type="submit"]').click();
        cy.on('window:alert', (str) => {
            if (str.includes('hora vencida')) {
                cy.get('select[formcontrolname="hora"]').select('15:00');
                cy.get('button[type="submit"]').click();
                cy.on('window:alert', (msg) => {
                    expect(msg).to.contain('¡Reserva exitosa!');
                });
            } else {
                expect(str).to.contain('¡Reserva exitosa!');
            }
        });
    });
});