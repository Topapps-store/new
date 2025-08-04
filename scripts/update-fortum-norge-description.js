import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateFortumDescription() {
  try {
    console.log('📝 Actualizando descripción de Fortum Charge & Drive Norge...');
    
    // Nueva descripción con todas las palabras clave
    const newDescription = `Fortum Charge & Drive Norge: Den ultimate ladeapp for elbil i Norge

Med Fortum Charge & Drive Norge får du som elbileier en sømløs ladeopplevelse og rask tilgang til over 50 000 ladepunkter i hele Norden. Som Nordens mest valgte strømleverandør tilbyr vi en komplett ladeapp som gjør elbillading enkelt og effektivt.

Koble enkelt til med Recharge, Kople, Mer, IONITY, Uno-X og mange flere ladestasjoner – alt gjennom kun én app og én RFID-nøkkel.

MED FORTUM CHARGE & DRIVE LADEAPP KAN DU:

• Få tilgang til 21 000 ladestasjoner over hele Norge og mer enn 50 000 ladepunkter over hele Norden.
• Starte og stoppe hurtiglading enkelt med RFID-nøkkel eller appen
• Finn ladestasjoner i nærheten av deg, eller planlegge reisen med den avanserte ruteplanlegger.
• Filtrere ladere etter type, hastighet og tilgjengelighet for å finne en som passer din elbil.
• Tilpasse søket etter hva bilen er kompatibel med.
• Angi foretrukne operatører eller lagre de ladestasjonene du liker best på ladekartet.
• Holde deg informert om priser i sanntid på alle ladestasjoner
• Velge å betale med kort, RFID-nøkkel, Google Pay eller Apple Pay.
• Se ladehistorikk fra alle dine ladeøkter på ett sted

BLI MED I FORTUM CHARGE & DRIVE-NETTVERKET OG OPPLEV STRESSFRI ELBILLADING MED VÅRT OMFATTENDE NETTVERK.

Kom i gang i dag:  
1. Last ned Fortum Charge & Drive ladeapp gratis.  
2. Sett opp kontoen din raskt.  
3. Legg til betalingsmetode eller bestill RFID-nøkkel for å forberede din første ladeøkt.  
4. Finn enkelt offentlige ladestasjoner i nærheten på ladekartet, eller bruk ruteplanlegger til å planlegge turen, og start hurtiglading med bare et trykk.  

OPPLEV HVOR PRAKTISK DET ER MED OFFENTLIG ELBILLADING MED FORTUM CHARGE & DRIVE I NORGE. 

Med vår ladeapp lader du elbilen enkelt og effektivt på offentlige ladestasjoner, og du kan finne og bruke ladestasjoner mens du er på farten. Enten du pendler, er på reise eller gjør daglige ærend, gir Fortum Charge & Drive sanntidsinformasjon og sømløs integrasjon for å forbedre ladeopplevelsen din. Opplev det omfattende ladenettverket med 50 000 ladepunkter, de uanstrengte start- og betalingsalternativer med Apple Pay, Google Pay eller betale med kort, og den intelligente ruteplanleggingen med vår avanserte ruteplanlegger som holder oversikt over din ladehistorikk. `;

    // Leer el archivo apps.json
    const appsJsonPath = path.join(__dirname, '../client/src/data/apps.json');
    const appsJsonContent = fs.readFileSync(appsJsonPath, 'utf8');
    const appsData = JSON.parse(appsJsonContent);
    
    // Encontrar la app de Fortum Norge
    const fortumNorgeIndex = appsData.apps.findIndex(app => app.id === 'fortum-charge-drive-norge-no');
    
    if (fortumNorgeIndex === -1) {
      console.log('❌ No se encontró la app fortum-charge-drive-norge-no');
      return;
    }
    
    // Crear backup
    const backupPath = path.join(__dirname, '../client/src/data/apps.json.backup-fortum-description');
    fs.writeFileSync(backupPath, appsJsonContent, 'utf8');
    console.log(`💾 Backup creado en: ${backupPath}`);
    
    // Actualizar la descripción
    appsData.apps[fortumNorgeIndex].description = newDescription;
    appsData.lastUpdated = new Date().toISOString();
    
    // Escribir el archivo actualizado
    fs.writeFileSync(
      appsJsonPath,
      JSON.stringify(appsData, null, 2),
      'utf8'
    );
    
    console.log('✅ Descripción actualizada exitosamente');
    console.log('\n📋 Palabras clave incluidas:');
    console.log('✓ Fortum Charge & Drive');
    console.log('✓ elbil');
    console.log('✓ ladeapp');
    console.log('✓ ladestasjoner');
    console.log('✓ hurtiglading');
    console.log('✓ ladekart');
    console.log('✓ betale med kort');
    console.log('✓ Apple Pay');
    console.log('✓ Google Pay');
    console.log('✓ RFID-nøkkel');
    console.log('✓ Norge');
    console.log('✓ 50 000 ladepunkter');
    console.log('✓ Nordens mest valgte strømleverandør');
    console.log('✓ ruteplanlegger');
    console.log('✓ ladehistorikk');
    
    console.log('\n🌐 La descripción optimizada está ahora disponible en /app/fortum-charge-drive-norge-no');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Ejecutar
updateFortumDescription();