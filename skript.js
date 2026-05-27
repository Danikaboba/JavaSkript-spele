//IGROVOE SOSTOJANIE (STATE)
let moneti = 0;
let kolichestvo_avto = 0;
let cena_avto = 10;
let uroven_klika = 1;
let cena_klika = 15;
let shans_krita = 1; 
let cena_krita = 50;
let kamni = 0; 
const TREBOVANIE_REBIRTHA = 1000; 

let oshibka_klika_vremja, oshibka_avto_vremja, oshibka_krita_vremja, oshibka_rebirtha_vremja;

//DOM ELEMENTI
const ekran_monet = document.getElementById('moneti_schetchik');
const ekran_cps_cpc = document.getElementById('cps_cpc_ekran'); // Объединенный экран для CPS и CPC
const ekran_kamnej = document.getElementById('kamni_schetchik');

const glavnij_kamen = document.getElementById('knopka_kamnja'); 
const knopka_pokupki_avto = document.getElementById('kupit_avto');
const knopka_pokupki_klika = document.getElementById('kupit_klik');
const knopka_pokupki_krita = document.getElementById('kupit_krit');
const knopka_samogo_rebirtha = document.getElementById('knopka_rebirtha');

// Элементы статистики под камнем
const ekran_urovnja_klika = document.getElementById('uroven_klika_schetchik');
const ekran_kolichestva_avto = document.getElementById('kolichestvo_avto_schetchik');
const ekran_shansa_krita = document.getElementById('shans_krita_schetchik');

//RASCHETI
function poluchit_mnozhitel() {
    return 1 + (kamni * 0.5);
}
function poluchit_silu_klika() {
    return uroven_klika * poluchit_mnozhitel();
}
function poluchit_avto_dohod() {
    return kolichestvo_avto * poluchit_mnozhitel();
}

//OBNOVLENIE EKRANA (UI)
function obnovit_ekran() {
    //Выводим просто число монет
    ekran_monet.textContent = Math.floor(moneti);
    
    //Обновляем строчку с камнями целиком
    ekran_kamnej.textContent = `Akmeņi: ${kamni} (x${poluchit_mnozhitel().toFixed(1)})`;
    
    //Обновляем строчку CPS и CPC целиком
    ekran_cps_cpc.textContent = `(CPS: ${poluchit_avto_dohod().toFixed(1)} | CPC: ${poluchit_silu_klika().toFixed(1)})`;

    //Обновляем статистику под камнем целиком
    ekran_urovnja_klika.textContent = `Klikšķa līm: ${uroven_klika}`;
    ekran_kolichestva_avto.textContent = `Auto fani: ${kolichestvo_avto}`;
    ekran_shansa_krita.textContent = `Krita iespēja: ${shans_krita}%`;

    //Тексты кнопок (если нет ошибок)
    if (!oshibka_klika_vremja) {
        knopka_pokupki_klika.textContent = `Klikšķis +1 (${cena_klika})`;
    }
    if (!oshibka_avto_vremja) {
        knopka_pokupki_avto.textContent = `Auto +1/s (${cena_avto})`;
    }
    if (!oshibka_krita_vremja) {
        if (shans_krita >= 50) {
            knopka_pokupki_krita.textContent = "MAX līmenis";
        } else {
            knopka_pokupki_krita.textContent = `Krita iespēja +2% (${cena_krita})`;
        }
    }
    if (!oshibka_rebirtha_vremja) {
        knopka_samogo_rebirtha.textContent = `Rebirth (Maksā: ${TREBOVANIE_REBIRTHA})`;
    }
}

//NAZHATIJA
glavnij_kamen.addEventListener('click', () => {
    let tekushaja_sila_klika = poluchit_silu_klika();
    const eto_krit = Math.floor(Math.random() * 100) + 1 <= shans_krita;
    if (eto_krit) {
        tekushaja_sila_klika = tekushaja_sila_klika * 10; 
    }
    moneti += tekushaja_sila_klika;
    obnovit_ekran();
});

knopka_pokupki_klika.addEventListener('click', () => {
    if (moneti >= cena_klika) {
        moneti -= cena_klika;
        uroven_klika += 1;
        cena_klika = Math.round(cena_klika * 1.5);
        obnovit_ekran();
    } else {
        let ne_hvataet = cena_klika - Math.floor(moneti);
        knopka_pokupki_klika.textContent = `Trūkst ${ne_hvataet} monētas!`;
        clearTimeout(oshibka_klika_vremja); 
        oshibka_klika_vremja = setTimeout(() => {
            oshibka_klika_vremja = null;
            obnovit_ekran();
        }, 1500);
    }
});

knopka_pokupki_avto.addEventListener('click', () => {
    if (moneti >= cena_avto) {
        moneti -= cena_avto;
        kolichestvo_avto += 1;
        cena_avto = Math.round(cena_avto * 1.4);
        obnovit_ekran();
    } else {
        let ne_hvataet = cena_avto - Math.floor(moneti);
        knopka_pokupki_avto.textContent = `Trūkst ${ne_hvataet} monētas!`;
        clearTimeout(oshibka_avto_vremja);
        oshibka_avto_vremja = setTimeout(() => {
            oshibka_avto_vremja = null;
            obnovit_ekran();
        }, 1500);
    }
});

knopka_pokupki_krita.addEventListener('click', () => {
    if (shans_krita >= 50) return;
    if (moneti >= cena_krita) {
        moneti -= cena_krita;
        shans_krita += 2; 
        cena_krita = Math.round(cena_krita * 2.2); 
        obnovit_ekran();
    } else {
        let ne_hvataet = cena_krita - Math.floor(moneti);
        knopka_pokupki_krita.textContent = `Trūkst ${ne_hvataet} monētas!`;
        clearTimeout(oshibka_krita_vremja);
        oshibka_krita_vremja = setTimeout(() => {
            oshibka_krita_vremja = null;
            obnovit_ekran();
        }, 1500);
    }
});

knopka_samogo_rebirtha.addEventListener('click', () => {
    if (moneti >= TREBOVANIE_REBIRTHA) {
        kamni += 1; 
        moneti = 0;
        kolichestvo_avto = 0;
        cena_avto = 10;
        uroven_klika = 1;
        cena_klika = 15;
        alert("Tu esi veiksmīgi atdzimis! Saņemts 1 Akmens.");
        obnovit_ekran();
    } else {
        let ne_hvataet = TREBOVANIE_REBIRTHA - Math.floor(moneti);
        knopka_samogo_rebirtha.textContent = `Trūkst ${ne_hvataet} monētas!`;
        clearTimeout(oshibka_rebirtha_vremja);
        oshibka_rebirtha_vremja = setTimeout(() => {
            oshibka_rebirtha_vremja = null;
            obnovit_ekran();
        }, 1500);
    }
});

//AUTOMATICHESKIJ CIKL
setInterval(() => {
    if (kolichestvo_avto > 0) {
        moneti += poluchit_avto_dohod() / 10;
        obnovit_ekran(); 
    }
}, 100);

obnovit_ekran();
