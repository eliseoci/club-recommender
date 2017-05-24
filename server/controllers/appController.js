var Fuzzy = require('../node_modules/fuzzylogic/lib/fuzzylogic')
var Rules = require('../node_modules/fuzzylogic/lib/rules')
    /**
     * POST /
     */

var getMaxObject = function(A) {
    var M = -Infinity;
    var Max_index = -1;
    for (var i = 0; i < A.length; i++) {
        if (A[i].value > M) {
            M = A[i].value;
            Max_index = i;
        }
    }
    return A[Max_index];
}

exports.fuzzify = function(req, res) {
        var user = req.body.user;
        var acu = 0;
        var count = 0;
        for (let i = 0; i < user.intereses.length; i++) {
            if (user.intereses[i].value == true) {
                count++;
                acu += user.intereses[i].tranquilidad
            }
        }

        var tranquilidadPromedio = acu / count;

        var adolescente = { name: 'adolescente', value: Fuzzy.triangle(user.edad, 10, 15, 20) }
        var joven = { name: 'joven', value: Fuzzy.triangle(user.edad, 18, 24, 30) }
        var jovenAdulto = { name: 'jovenAdulto', value: Fuzzy.triangle(user.edad, 26, 34, 40) }
        var adulto = { name: 'adulto', value: Fuzzy.triangle(user.edad, 35, 45, 55) }
        var viejo = { name: 'viejo', value: Fuzzy.trapezoid(user.edad, 50, 70, 90, 120) }

        var tranquilo = { name: 'tranquilo', value: Fuzzy.triangle(tranquilidadPromedio, 1, 2, 4) }
        var tranquiloMedio = { name: 'tranquiloMedio', value: Fuzzy.triangle(tranquilidadPromedio, 3, 5, 7) }
        var movido = { name: 'movido', value: Fuzzy.triangle(tranquilidadPromedio, 6, 8, 10) }


        var pocaPlata = { name: 'poca', value: Fuzzy.triangle(user.presupuesto, 0, 100, 150) }
        var medioPlata = { name: 'media', value: Fuzzy.triangle(user.presupuesto, 120, 350, 500) }
        var muchaPlata = { name: 'mucha', value: Fuzzy.triangle(user.presupuesto, 450, 600, 2000, 3000) }

        var mañana = { name: 'mañana', value: Fuzzy.triangle(user.horario, 8, 10, 13) }
        var tarde = { name: 'tarde', value: Fuzzy.triangle(user.horario, 12, 17, 19) }
        var noche = { name: 'noche', value: Fuzzy.triangle(user.horario, 18, 20, 24) }


        var arrayEdad = [adolescente, joven, jovenAdulto, adulto, viejo]
        var arrayPlata = [pocaPlata, medioPlata, muchaPlata]
        var arrayTranq = [tranquilo, tranquiloMedio, movido]
        var arrayHorario = [mañana, tarde, noche]

        var maxEdad = getMaxObject(arrayEdad);
        var maxPlata = getMaxObject(arrayPlata);
        var maxAmbiente = getMaxObject(arrayTranq);
        var maxHorario = getMaxObject(arrayHorario);

        //IF R1
        if (maxEdad.name == 'adolescente' && maxAmbiente.name == 'tranquilo') {
            var lugar = 'cine';
            if (maxPlata.name == 'poca') {
                res.json('Quedate en tu casa');
            } else if (maxPlata.name == 'media') {
                if (maxHorario.name == 'mañana') {
                    res.json('CINE SUNSTAR - LOS PITUFOS 3');
                    }
                    else if (maxHorario.name == 'tarde') {
                        res.json('CINE ATLAS - EL REY ARTURO')
                    } else {
                        res.json('CINE ATLAS - RAPIDO Y FURIOSOS 8')
                    }
                }
            }

            // IF R2
            if (maxEdad.name == 'adolescente' && maxAmbiente.name == 'tranquiloMedio') {
                var lugar = 'bar';
                if (maxPlata.name == 'poca') {
                    res.json('quedate en tu casa, hacete pochoclos');
                } else if (maxPlata.name == 'media' || maxPlata.name == 'mucha') {
                    var lugar = 'bar';
                    if (user.comida == 'vegatariano') {
                        res.json('Vegolandia - muñecas 574');
                    } else if (user.comida == 'celiaco') {
                        res.json('El parador');
                    } else if (user.comida == 'minutas') {
                        res.json('El Kun / El 10 / Chacho');
                    } else if (user.comida == 'plato') {
                        res.json('Il Postino / El quebracho / La querencia');
                    } else {
                        res.json('Tic tac toe')
                    }
                }
            }

            // IF R3
            if (maxEdad.name == 'adolescente' && maxAmbiente.name == 'movido') {
                var lugar = 'boliche';
                if (maxPlata.name == 'poca') {
                    res.json('quedate en tu casa, hacete pochoclos');
                } else if (maxPlata.name == 'media' || maxPlata.name == 'mucha') {
                    var lugar = 'boliche';
                    if (user.generoMusical){
                        res.json('Matine Huerto, Baile de colegios.');
                    }
                }
            }

            // IF R4
            if (maxEdad.name == 'joven' && maxAmbiente.name == 'tranquilo') {
                if (maxPlata.name == 'poca') {
                    res.json('Quedate en tu casa');
                } else if (maxPlata.name == 'media') {
                    if (maxHorario.name == 'mañana') {
                        res.json('LOS PITUFOS 3 - SUNSTAR')
                    } else if (maxHorario.name == 'tarde') {
                        res.json('UN JEFE EN PAÑALES - CINE ATLAS')
                    } else {
                        res.json('RAPIDOS Y FURIOSOS 8 - CINE ATLAS')
                    }
                } else {
                    if (user.comida == 'vegetariano') {
                        res.json('Vegolandia - Muñecas 242')
                    } else if (user.comida == 'celiaco') {
                        res.json('El Parador')
                    } else if (user.comida == 'minutas') {
                        res.json('El rancho criollo')
                    } else if (user.comida == 'plato') {
                        res.json('Il Postino')
                    } else {
                        res.json('Plaza Urquiza')
                    }
                }

            }

            // IF R5
            if (maxEdad.name == 'joven' && maxAmbiente.name == 'tranquiloMedio') {
                var lugar = 'bar/pub';
                if (maxPlata.name == 'poca') {
                    res.json('quedate en tu casa, hacete pochoclos');
                } else if (maxPlata.name == 'media') {
                    var lugar = 'pub';
                    if (user.generoMusical == 'electro') {
                        res.json('ElectroPub');
                    } else if (user.generoMusical == 'cumbia') {
                        res.json('PaTuCumbia Pub');
                    } else if (user.generoMusical == 'pop') {
                        res.json('La San Juan / Black');
                    } else if (user.generoMusical == 'rock') {
                        res.json('La Rockola / Irlanda');
                    } else {
                        res.json('La Barra - 25 y Corrientes')
                    }
                } else if (maxPlata.name == 'mucha') {
                    var lugar = 'bar';
                    if (user.comida == 'vegatariano') {
                        res.json('Vegolandia - muñecas 574');
                    } else if (user.comida == 'celiaco') {
                        res.json('El parador');
                    } else if (user.comida == 'minutas') {
                        res.json('El rancho criollo / El 10 / San telmo')
                    } else if (user.comida == 'plato') {
                        res.json('II Postino / El quebracho / La querencia');
                    } else if (user.generoMusical == 'electro') {
                        res.json('ElectroPub');
                    } else if (user.generoMusical == 'cumbia') {
                        res.json('PaTuCumbia Pub');
                    } else if (user.generoMusical == 'pop') {
                        res.json('La San Juan / Black');
                    } else if (user.generoMusical == 'rock') {
                        res.json('La Rockola / Irlanda');
                    } else {
                        res.json('Chacapiedras')
                    }
                }
            }

            // IF R6
            if (maxEdad.name == 'joven' && maxAmbiente.name == 'movido') {
                if (maxPlata == 'poca') {
                    res.json('Quedate en tu casa')
                } else if (maxPlata == 'media') {
                    if (user.generoMusical == 'electro') {
                        res.json('La Boite')
                    } else if (user.generoMusical == 'cumbia') {
                        res.json('Galactica')
                    } else if (user.generoMusical == 'pop') {
                        res.json('Recorcholis')
                    } else if (user.generoMusical == 'rock') {
                        res.json('La Boite')
                    } else {
                        res.json('Recorcholis')
                    }
                } else {
                    if (user.generoMusical == 'electro') {
                        res.json('La Boite')
                    } else if (user.generoMusical == 'cumbia') {
                        res.json('Galactica')
                    } else if (user.generoMusical == 'pop') {
                        res.json('Recorcholis')
                    } else if (user.generoMusical == 'rock') {
                        res.json('La Boite')
                    } else {
                        res.json('Recorcholis')
                    }
                }
            }

            // IF R7
            if (maxEdad.name == 'jovenAdulto' && maxAmbiente.name == 'tranquilo') {
                var lugar = 'bar';
                if (maxPlata.name == 'poca') {
                    res.json('quedate en tu casa, hacete pochoclos');
                } else if (maxPlata.name == 'mucha') {
                    var lugar = 'bar';
                    if (user.comida == 'vegatariano') {
                        res.json('Vegolandia - muñecas 574');
                    } else if (user.comida == 'celiaco') {
                        res.json('El parador');
                    } else if (user.comida == 'minutas') {
                        res.json('El Kun / El 10 / Chacho');
                    } else if (user.comida == 'plato') {
                        res.json('Il Postino / El quebracho / La querencia');
                    } else {
                        res.json('Cafe Martinez')
                    }
                } else {
                    if (maxHorario == 'mañana') {
                        res.json('LOS PITUFOS 3 - SUNSTAR')
                    } else if (maxHorario == 'tarde') {
                        res.json('UN JEFE EN PAÑALES - CINE ATLAS')
                    } else {
                        res.json('RAPIDOS Y FURIOSOS 8 - CINE ATLAS')
                    }
                }
            }

            // IF R8
            if (maxEdad.name == 'jovenAdulto' && maxAmbiente.name == 'tranquiloMedio') {
                var lugar = 'bar';
                if (maxPlata.name == 'poca') {
                    res.json('quedate en tu casa, hacete pochoclos');
                } else if (maxPlata.name == 'media') {
                    var lugar = 'bar';
                    if (user.comida == 'vegatariano') {
                        res.json('Vegolandia - muñecas 574');
                    } else if (user.comida == 'celiaco') {
                        res.json('El parador');
                    } else if (user.comida == 'minutas') {
                        res.json('El Kun / El 10 / Chacho');
                    } else if (user.comida == 'plato') {
                        res.json('Il Postino / El quebracho / La querencia');
                    } else {
                        res.json('Beckets')
                    }
                } else {
                    if (user.generoMusical == 'electro') {
                        res.json('Jhonny B. Good')
                    } else if (user.generoMusical == 'cumbia') {
                        res.json('PaTuCumbia Pub')
                    } else if (user.generoMusical == 'pop') {
                        res.json('La San Juan')
                    } else if (user.generoMusical == 'rock') {
                        res.json('Bar Irlanda')
                    } else {
                        res.json('Dublin')
                    }
                }
            }

            //IF R9
            if (maxEdad.name == 'jovenAdulto' && maxAmbiente.name == 'movido') {
                var lugar = 'boliche';
                if (maxPlata.name == 'poca') {
                    res.json('quedate en tu casa, hacete pochoclos');
                } else if (maxPlata.name == 'media' || maxPlata.name == 'mucha') {
                    var lugar = 'pub';
                    if (user.generoMusical == 'electro') {
                        res.json('La Boite/ Pollock');
                    } else if (user.generoMusical == 'cumbia') {
                        res.json('La metro');
                    } else if (user.generoMusical == 'pop') {
                        res.json('Lancaster / Shampoo');
                    } else if (user.generoMusical == 'rock') {
                        res.json('La Boite');
                    } else {
                        res.json('Black')
                    }
                }
            }

            // IF R10
            if (maxEdad.name == 'adulto' && maxAmbiente.name == 'tranquilo') {
                if (maxPlata.name == 'poca') {
                    res.json('quedate en tu casa, hacete pochoclos');
                } else if (maxPlata.name == 'media') {
                    if (user.comida == 'vegetariano') {
                        res.json('Vegolandia - Muñecas 242')
                    } else if (user.comida == 'celiaco') {
                        res.json('El Parador')
                    } else if (user.comida == 'minutas') {
                        res.json('El rancho criollo')
                    } else if (user.comida == 'plato') {
                        res.json('Il Postino')
                    } else {
                        res.json('Cafe Martinez')
                    }
                } else {
                    if (maxHorario == 'mañana') {
                        res.json('Teatro San Martin')
                    } else if (maxHorario == 'tarde') {
                        res.json('Teatro Alberdi')
                    } else {
                        res.json('Teatro Mercedes Sosa')
                    }
                }
            }

            // IF R12
            if (maxEdad.name == 'adulto' && maxAmbiente.name == 'movida') {
                if (maxPlata.name == 'poca') {
                    res.json('quedate en tu casa, hacete pochoclos');
                } else if (maxPlata.name == 'media') {
                    if (user.generoMusical == 'electro') {
                        res.json('La Boite/ Pollock');
                    } else if (user.generoMusical == 'cumbia') {
                        res.json('La metro');
                    } else if (user.generoMusical == 'pop') {
                        res.json('Lancaster / Shampoo');
                    } else if (user.generoMusical == 'rock') {
                        res.json('La Boite');
                    }
                } else {
                    if (user.generoMusical == 'electro') {
                        res.json('La Boite/ Pollock');
                    } else if (user.generoMusical == 'cumbia') {
                        res.json('La metro');
                    } else if (user.generoMusical == 'pop') {
                        res.json('Lancaster / Shampoo');
                    } else if (user.generoMusical == 'rock') {
                        res.json('La Boite');
                    } else {
                        res.json('Black')
                    }
                }
            }
            // IF R13
            if (maxEdad.name == 'viejo' && maxAmbiente.name == 'tranquilo') {
                if (maxPlata.name == 'poca') {
                    res.json('quedarte en tu casa, hacerte pochoclos');
                } else if (maxPlata.name == 'media') {
                    if (maxHorario.name == 'mañana') {
                        res.json('LOS PITUFOS 3 - SUNSTAR')
                    } else if (maxHorario.name == 'tarde') {
                        res.json('UN JEFE EN PAÑALES - CINE ATLAS')
                    } else {
                        res.json('RAPIDOS Y FURIOSOS 8 - CINE ATLAS')
                    }
                } else {
                    if (maxHorario.name == 'mañana') {
                        res.json('Teatro San Martin')
                    } else if (maxHorario.name == 'tarde') {
                        res.json('Teatro Alberdi')
                    } else {
                        res.json('Teatro Mercedes Sosa')
                    }
                }
            }
            //R14
            if (maxEdad.name == 'viejo' && maxAmbiente.name == 'tranquiloMedio') {
                var lugar = 'restaurante/bar';
                if (maxPlata.name == 'poca') {
                    res.json('quedarse en su casa');
                } else if (maxPlata.name == 'media' || maxPlata.name == 'mucha') {
                    var lugar = 'bar';
                    if (user.comida == 'vegetariano') {
                        res.json('Vegolandia - muñecas 574');
                    } else if (user.comida == 'celiaco') {
                        res.json('El parador');
                    } else if (user.comida == 'minutas') {
                        res.json('El rancho criollo');
                    } else if (user.comida == 'plato') {
                        res.json('II Postino / El qubracho');
                    } else {
                        res.json('Hotel Hilton')
                    }
                }
            }


            //IF R15
            if (maxEdad.name == 'viejo' && maxAmbiente.name == 'movido') {
                if (maxPlata.name == 'poca') {
                    res.json('quedate en tu casa, hacete pochoclos');
                } else if (maxPlata.name == 'media') {
                    if (user.comida == 'vegetariano') {
                        res.json('Vegolandia - Muñecas 242')
                    } else if (user.comida == 'celiaco') {
                        res.json('El Parador')
                    } else if (user.comida == 'minutas') {
                        res.json('El rancho criollo')
                    } else if (user.comida == 'plato') {
                        res.json('Il Postino')
                    } else {
                        res.json('Hotel Hilton')
                    }
                } else {
                    if (user.generoMusical == 'electro') {
                        res.json('Sheraton');
                    } else if (user.generoMusical == 'cumbia') {
                        res.json('Centro de Jubilados - San Lorenzo 1100');
                    } else if (user.generoMusical == 'pop') {
                        res.json('Casino del Parque');
                    } else if (user.generoMusical == 'rock') {
                        res.json('Casino Blue');
                    } else {
                        res.json('Sheraton')
                    }
                }
            }

            res.json({
                maxEdad: maxEdad.name,
                maxPlata: maxPlata.name,
                maxAmbiente: maxAmbiente.name,
                maxHorario: maxHorario.name
            })
        };
