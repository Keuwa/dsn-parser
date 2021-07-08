const csv = require('csv-parser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
var _ = require('lodash');
const fs = require('fs')
const results = {
  // 'versements': []
};

var testCount = 0;

// général
const month = 'S20.G00.05.005' //mont
const entreprise = 'S21.G00.06.001' //siret
const etablissement = 'S21.G00.11.001' //nic

var currentMonth = ''
var currentEntreprise = ''
var currentEtablissement = ''

//versement 
const versementCodeOrga = 'S21.G00.20.001'
const versementMontantOrga = 'S21.G00.20.005'
//bordereaux
const borderauxSiretOrga = 'S21.G00.22.001'
const borderauxPeriode = 'S21.G00.22.003'
const borderauxMontantOrganismePeriode = 'S21.G00.22.005'

var currentBorderauxSiretOrga = ''
var currentBorderauxPeriode = ''
// var currentBorderauxMontantOrganismePeriode = ''

// COTISATIONS AGREGEES
const cotisationCtp = 'S21.G00.23.001'
const cotisationAssiette = 'S21.G00.23.002'
const cotisationTaux = 'S21.G00.23.003'
const cotisationMontantAssiette = 'S21.G00.23.004'
const cotisationMontantCotisation = 'S21.G00.23.005'

// SALARIES
const salariesNumeroSS = 'S21.G00.30.001'
const salariesNom = 'S21.G00.30.002'
const salariesPrenom = 'S21.G00.30.004'
const salariesEmploie = 'S21.G00.40.006'
const salariesNatureContrat = 'S21.G00.40.007'
const salariesNumeroContrat = 'S21.G00.40.009'
const salariesHeuresReference = 'S21.G00.40.012'
const salariesHeuresSalaries = 'S21.G00.40.013'
const salariesTauxAt = 'S21.G00.40.043'
// ADDED 17/05/2021
const salariesDateDebutContrat = 'S21.G00.40.001'
const salariesSatut = 'S21.G00.40.002'
const salariesDispositif = 'S21.G00.40.008'
const salariesDateFinPrevisionnelle = 'S21.G00.40.010'
const salariesUniteMesure = 'S21.G00.40.011'
const salariesModaliteTemps = 'S21.G00.40.014'


var currentSalariesNumeroSS = ''

// 51 REMUNERATION
const remunerationPeriode = 'S21.G00.51.001';
const remunerationNumeroContrat = 'S21.G00.51.010';
const remunerationTypeBase = 'S21.G00.51.011';
const remunerationMontantBase = 'S21.G00.51.013';

var currentRemunerationNumeroContrat = ''


// 78 BASE ASSUJETTIE
const baseAssujettieCode = 'S21.G00.78.001';
const baseAssujettiePeriode = 'S21.G00.78.002';
const baseAssujettieBase = 'S21.G00.78.004';
// const baseAssujettieNumeroContrat = 'S21.G00.78.006';

var currentBaseAssujettiePeriode = ''

// 79 COMPOSANT BASE ASSUJETTIE
const composantBase = 'S21.G00.79.001'
const composantBaseMontant = 'S21.G00.79.004'

// 81 COTISATION INDIVIDUELLE
const cotisationIndividuelleCode = 'S21.G00.81.001'
const cotisationIndividuelleAssiette = 'S21.G00.81.003'
const cotisationIndividuelleCotisation = 'S21.G00.81.004'



fs.createReadStream('data2.dsn')
  .pipe(csv(['code', 'value']))
  .on('data', (data) => {
    data['value'] = data['value'].replaceAll('\'', '');

    if(data['code'] == month){
      results[data['value']] = {}
      currentMonth = data['value']
    }
    else if(data['code'] == entreprise){
      results[currentMonth][data['value']] = {}
      currentEntreprise = data['value']
    }
    else if(data['code'] == etablissement){
      results[currentMonth][currentEntreprise][data['value']] = {}
      currentEtablissement = data['value']
    }

    /**
     * VERSEMENT
     */
    else if(data['code'] == versementCodeOrga){
      if (typeof results[currentMonth][currentEntreprise][currentEtablissement]['versements'] === 'undefined'){
        results[currentMonth][currentEntreprise][currentEtablissement]['versements'] = []
      }
      results[currentMonth][currentEntreprise][currentEtablissement]['versements'].push({
        'mois': currentMonth,
        'siren': currentEntreprise,
        'nic': currentEtablissement,
        'codeOrganisme': data['value'],
      })
    }
    else if(data['code'] == versementMontantOrga){
      var lastIndex = results[currentMonth][currentEntreprise][currentEtablissement]['versements'].length - 1
      results[currentMonth][currentEntreprise][currentEtablissement]['versements'][lastIndex]['versementMontantOrga'] = data['value']
    }
    /**
     * END VERSEMENT
     */

    /**
     * BORDERAUX
     */
     else if(data['code'] == borderauxSiretOrga){
      // console.log(testCount++) 
      if (typeof results[currentMonth][currentEntreprise][currentEtablissement]['borderaux'] === 'undefined'){
        results[currentMonth][currentEntreprise][currentEtablissement]['borderaux'] = []
      }
      currentBorderauxSiretOrga = data['value']
      
      results[currentMonth][currentEntreprise][currentEtablissement]['borderaux'].push({
        'mois': currentMonth,
        'siren': currentEntreprise,
        'nic': currentEtablissement,
        'siretOrganisme': data['value'],
      })
    }
    else if(data['code'] == borderauxPeriode){
      var lastIndex = results[currentMonth][currentEntreprise][currentEtablissement]['borderaux'].length - 1

      currentBorderauxPeriode = data['value'];

      results[currentMonth][currentEntreprise][currentEtablissement]['borderaux'][lastIndex]['periode'] = data['value']
    }
    else if(data['code'] == borderauxMontantOrganismePeriode){
      var lastIndex = results[currentMonth][currentEntreprise][currentEtablissement]['borderaux'].length - 1
      results[currentMonth][currentEntreprise][currentEtablissement]['borderaux'][lastIndex]['montantPeriode'] = data['value']
    }
    /**
     * END BORDERAUX
     */
    /**
     * Cotisation agregees
     */
    else if(data['code'] == cotisationCtp) {
      if (typeof results[currentMonth][currentEntreprise][currentEtablissement]['cotisationAgregees'] === 'undefined'){
        results[currentMonth][currentEntreprise][currentEtablissement]['cotisationAgregees'] = []
      }
      results[currentMonth][currentEntreprise][currentEtablissement]['cotisationAgregees'].push({
        'mois': currentMonth,
        'siren': currentEntreprise,
        'nic': currentEtablissement,
        'siretOrganisme': currentBorderauxSiretOrga,
        'periode': currentBorderauxPeriode,
        'ctp': data['value'],
      })
    }
    else if(data['code'] == cotisationAssiette){
      var lastIndex = results[currentMonth][currentEntreprise][currentEtablissement]['cotisationAgregees'].length - 1

      results[currentMonth][currentEntreprise][currentEtablissement]['cotisationAgregees'][lastIndex]['assiette'] = data['value']
    }
    else if(data['code'] == cotisationTaux){
      var lastIndex = results[currentMonth][currentEntreprise][currentEtablissement]['cotisationAgregees'].length - 1

      results[currentMonth][currentEntreprise][currentEtablissement]['cotisationAgregees'][lastIndex]['taux'] = data['value']
    }
    else if(data['code'] == cotisationMontantAssiette){
      var lastIndex = results[currentMonth][currentEntreprise][currentEtablissement]['cotisationAgregees'].length - 1

      results[currentMonth][currentEntreprise][currentEtablissement]['cotisationAgregees'][lastIndex]['montantAssiette'] = data['value']
    }
    else if(data['code'] == cotisationMontantCotisation){
      var lastIndex = results[currentMonth][currentEntreprise][currentEtablissement]['cotisationAgregees'].length - 1

      results[currentMonth][currentEntreprise][currentEtablissement]['cotisationAgregees'][lastIndex]['montantCotisation'] = data['value']
    }
    /**
     * END COTISATION agregees
     */
    /**
     * SALARIEs
     */
    else if(data['code'] == salariesNumeroSS) {
      if (typeof results[currentMonth][currentEntreprise][currentEtablissement]['salaries'] === 'undefined'){
        results[currentMonth][currentEntreprise][currentEtablissement]['salaries'] = []
      }

      currentSalariesNumeroSS = data['value'];

      results[currentMonth][currentEntreprise][currentEtablissement]['salaries'].push({
        'mois': currentMonth,
        'siren': currentEntreprise,
        'nic': currentEtablissement,
        'numeroSS': data['value'],
      })
    }
    else if(data['code'] == salariesNom) {
      var lastIndex = results[currentMonth][currentEntreprise][currentEtablissement]['salaries'].length - 1

      results[currentMonth][currentEntreprise][currentEtablissement]['salaries'][lastIndex]['nom'] = data['value']
    }
    else if(data['code'] == salariesPrenom) {
      var lastIndex = results[currentMonth][currentEntreprise][currentEtablissement]['salaries'].length - 1

      results[currentMonth][currentEntreprise][currentEtablissement]['salaries'][lastIndex]['prenom'] = data['value']
    }
    else if(data['code'] === salariesEmploie) {
      var lastIndex = results[currentMonth][currentEntreprise][currentEtablissement]['salaries'].length - 1

      results[currentMonth][currentEntreprise][currentEtablissement]['salaries'][lastIndex]['emploie'] = data['value']
    }
    else if(data['code'] == salariesNatureContrat) {
      var lastIndex = results[currentMonth][currentEntreprise][currentEtablissement]['salaries'].length - 1

      results[currentMonth][currentEntreprise][currentEtablissement]['salaries'][lastIndex]['natureContrat'] = data['value']
    }
    else if(data['code'] == salariesNumeroContrat) {
      var lastIndex = results[currentMonth][currentEntreprise][currentEtablissement]['salaries'].length - 1

      results[currentMonth][currentEntreprise][currentEtablissement]['salaries'][lastIndex]['numeroContrat'] = data['value']
    }
    else if(data['code'] == salariesHeuresReference) {
      var lastIndex = results[currentMonth][currentEntreprise][currentEtablissement]['salaries'].length - 1

      results[currentMonth][currentEntreprise][currentEtablissement]['salaries'][lastIndex]['heuresReference'] = data['value']
    }
    else if(data['code'] == salariesHeuresSalaries) {
      var lastIndex = results[currentMonth][currentEntreprise][currentEtablissement]['salaries'].length - 1

      results[currentMonth][currentEntreprise][currentEtablissement]['salaries'][lastIndex]['heuresSalaries'] = data['value']
    }
    else if(data['code'] == salariesTauxAt) {
      var lastIndex = results[currentMonth][currentEntreprise][currentEtablissement]['salaries'].length - 1

      results[currentMonth][currentEntreprise][currentEtablissement]['salaries'][lastIndex]['tauxAt'] = data['value']
    }
    else if(data['code'] == salariesDateDebutContrat) {
      var lastIndex = results[currentMonth][currentEntreprise][currentEtablissement]['salaries'].length - 1

      results[currentMonth][currentEntreprise][currentEtablissement]['salaries'][lastIndex]['dateDebutContrat'] = data['value']
    }
    else if(data['code'] == salariesSatut) {
      var lastIndex = results[currentMonth][currentEntreprise][currentEtablissement]['salaries'].length - 1

      results[currentMonth][currentEntreprise][currentEtablissement]['salaries'][lastIndex]['statut'] = data['value']
    }
    else if(data['code'] == salariesDispositif) {
      var lastIndex = results[currentMonth][currentEntreprise][currentEtablissement]['salaries'].length - 1

      results[currentMonth][currentEntreprise][currentEtablissement]['salaries'][lastIndex]['dispositif'] = data['value']
    }
    else if(data['code'] == salariesDateFinPrevisionnelle) {
      var lastIndex = results[currentMonth][currentEntreprise][currentEtablissement]['salaries'].length - 1

      results[currentMonth][currentEntreprise][currentEtablissement]['salaries'][lastIndex]['dateFinPrevisionnelle'] = data['value']
    }
    else if(data['code'] == salariesUniteMesure) {
      var lastIndex = results[currentMonth][currentEntreprise][currentEtablissement]['salaries'].length - 1

      results[currentMonth][currentEntreprise][currentEtablissement]['salaries'][lastIndex]['uniteMesure'] = data['value']
    }
    else if(data['code'] == salariesModaliteTemps) {
      var lastIndex = results[currentMonth][currentEntreprise][currentEtablissement]['salaries'].length - 1

      results[currentMonth][currentEntreprise][currentEtablissement]['salaries'][lastIndex]['modaliteTemps'] = data['value']
    }

    /**
     * END SALARIEs
     */

    /**
     * Remuneration
     */
     else if(data['code'] == remunerationPeriode) {
      if (typeof results[currentMonth][currentEntreprise][currentEtablissement]['remuneration'] === 'undefined'){
        results[currentMonth][currentEntreprise][currentEtablissement]['remuneration'] = []
      }
      results[currentMonth][currentEntreprise][currentEtablissement]['remuneration'].push({
        'mois': currentMonth,
        'siren': currentEntreprise,
        'nic': currentEtablissement,
        'numeroSS': currentSalariesNumeroSS,
        'periode': data['value'],
      })
    }
    else if(data['code'] == remunerationNumeroContrat) {
      var lastIndex = results[currentMonth][currentEntreprise][currentEtablissement]['remuneration'].length - 1

      currentRemunerationNumeroContrat = data['value']


      results[currentMonth][currentEntreprise][currentEtablissement]['remuneration'][lastIndex]['numeroContrat'] = data['value']
    }
    else if(data['code'] == remunerationTypeBase) {
      var lastIndex = results[currentMonth][currentEntreprise][currentEtablissement]['remuneration'].length - 1

      results[currentMonth][currentEntreprise][currentEtablissement]['remuneration'][lastIndex]['typeBase'] = data['value']
    }
    else if(data['code'] == remunerationMontantBase) {
      var lastIndex = results[currentMonth][currentEntreprise][currentEtablissement]['remuneration'].length - 1

      results[currentMonth][currentEntreprise][currentEtablissement]['remuneration'][lastIndex]['montantBase'] = data['value']
    }
    /**
     * End remunération
     */

    /**
     * Base Asujetti
     */
    else if(data['code'] == baseAssujettieCode) {
      if (typeof results[currentMonth][currentEntreprise][currentEtablissement]['baseAssujettie'] === 'undefined'){
        results[currentMonth][currentEntreprise][currentEtablissement]['baseAssujettie'] = []
      }
      results[currentMonth][currentEntreprise][currentEtablissement]['baseAssujettie'].push({
        'mois': currentMonth,
        'siren': currentEntreprise,
        'nic': currentEtablissement,
        'numeroSS': currentSalariesNumeroSS,
        'numeroContrat': currentRemunerationNumeroContrat,
        'codeBase': data['value'],
      })
    }
    else if(data['code'] == baseAssujettiePeriode) {
      var lastIndex = results[currentMonth][currentEntreprise][currentEtablissement]['baseAssujettie'].length - 1

      currentBaseAssujettiePeriode = data['value']

      results[currentMonth][currentEntreprise][currentEtablissement]['baseAssujettie'][lastIndex]['periode'] = data['value']
    }
    else if(data['code'] == baseAssujettieBase) {
      var lastIndex = results[currentMonth][currentEntreprise][currentEtablissement]['baseAssujettie'].length - 1

      results[currentMonth][currentEntreprise][currentEtablissement]['baseAssujettie'][lastIndex]['base'] = data['value']
    }
    // else if(data['code'] == baseAssujettieNumeroContrat) {
    //   var lastIndex = results[currentMonth][currentEntreprise][currentEtablissement]['baseAssujettie'].length - 1

    //   results[currentMonth][currentEntreprise][currentEtablissement]['baseAssujettie'][lastIndex]['numeroContrat'] = data['value']
    // }

    /**
     * End Base Asujetti
     */

    /**
     * composantBaseAssujettie
     */
    else if(data['code'] == composantBase) {
      if (typeof results[currentMonth][currentEntreprise][currentEtablissement]['composantBaseAssujettie'] === 'undefined'){
        results[currentMonth][currentEntreprise][currentEtablissement]['composantBaseAssujettie'] = []
      }
      results[currentMonth][currentEntreprise][currentEtablissement]['composantBaseAssujettie'].push({
        'mois': currentMonth,
        'siren': currentEntreprise,
        'nic': currentEtablissement,
        'numeroSS': currentSalariesNumeroSS,
        'numeroContrat': currentRemunerationNumeroContrat,
        'periode': currentBaseAssujettiePeriode,
        'base': data['value'],
      })
    }
    else if(data['code'] == composantBaseMontant) {
      var lastIndex = results[currentMonth][currentEntreprise][currentEtablissement]['composantBaseAssujettie'].length - 1

      currentcomposantBaseAssujettiePeriode = data['value']

      results[currentMonth][currentEntreprise][currentEtablissement]['composantBaseAssujettie'][lastIndex]['montantBase'] = data['value']
    }
    /**
     * End composantBaseAssujettie
     */

    /**
     * Coti individuelle
     */
     else if(data['code'] == cotisationIndividuelleCode) {
      if (typeof results[currentMonth][currentEntreprise][currentEtablissement]['cotisationIndividuelle'] === 'undefined'){
        results[currentMonth][currentEntreprise][currentEtablissement]['cotisationIndividuelle'] = []
      }
      results[currentMonth][currentEntreprise][currentEtablissement]['cotisationIndividuelle'].push({
        'mois': currentMonth,
        'siren': currentEntreprise,
        'nic': currentEtablissement,
        'numeroSS': currentSalariesNumeroSS,
        'numeroContrat': currentRemunerationNumeroContrat,
        'periode': currentBaseAssujettiePeriode,
        'codeCotisation': data['value'],
      })
    }
    else if(data['code'] == cotisationIndividuelleAssiette) {
      var lastIndex = results[currentMonth][currentEntreprise][currentEtablissement]['cotisationIndividuelle'].length - 1

      results[currentMonth][currentEntreprise][currentEtablissement]['cotisationIndividuelle'][lastIndex]['assiette'] = data['value']
    }
    else if(data['code'] == cotisationIndividuelleCotisation) {
      var lastIndex = results[currentMonth][currentEntreprise][currentEtablissement]['cotisationIndividuelle'].length - 1

      results[currentMonth][currentEntreprise][currentEtablissement]['cotisationIndividuelle'][lastIndex]['cotisation'] = data['value']
    }
    /**
     * END
     */

})
  .on('end', () => {
    
  var versements = []
  var bordereaux = []
  var cotisationAgregees = []
  var salaries = []
  var remuneration = []
  var baseAssujettie = []
  var composantBaseAssujettie = []
  var cotisationIndividuelle = []

  _.forEach(results, function(months){
    _.forEach(months, function(entreprise){
      _.forEach(entreprise, function(etablissement){
        versements = _.concat(versements, etablissement['versements'])
        bordereaux = _.concat(bordereaux, etablissement['borderaux'])
        cotisationAgregees = _.concat(cotisationAgregees, etablissement['cotisationAgregees'])
        console.log(salaries)
        salaries = _.concat(salaries, etablissement['salaries'])
        remuneration = _.concat(remuneration, etablissement['remuneration'])
        baseAssujettie = _.concat(baseAssujettie, etablissement['baseAssujettie'])
        composantBaseAssujettie = _.concat(composantBaseAssujettie, etablissement['composantBaseAssujettie'])
        cotisationIndividuelle = _.concat(cotisationIndividuelle, etablissement['cotisationIndividuelle'])
      })
    })
  })

  const versementHeader = [
    {id: 'mois',  title: 'Mois'},
    {id: 'siren', title: 'Siren'},
    {id: 'nic',   title: 'Nic'},
    {id: 'codeOrganisme', title: 'CodeOrganisme'},
    {id: 'versementMontantOrga', title: 'MontantOrganisme'},
  ]

  const bordereauxHeader = [
    {id: 'mois',  title: 'Mois'},
    {id: 'siren', title: 'Siren'},
    {id: 'nic',   title: 'Nic'},
    {id: 'siretOrganisme', title: 'CodeOrganisme'},
    {id: 'periode', title: 'Periode'},
    {id: 'montantPeriode', title: 'MontantPeriode'},
  ]

  const cotisationAgregeesHeader = [
    {id: 'mois',  title: 'Mois'},
    {id: 'siren', title: 'Siren'},
    {id: 'nic',   title: 'Nic'},
    {id: 'siretOrganisme', title: 'CodeOrganisme'},
    {id: 'periode', title: 'Periode'},
    {id: 'ctp', title: 'CTP'},
    {id: 'assiette', title: 'Type assiette'},
    {id: 'taux', title: 'Taux'},
    {id: 'montantAssiette', title: 'Assiette'},
    {id: 'montantCotisation', title: 'Montant'},
  ]

  const salariesHeader = [
    {id: 'numeroSS', title: 'NuméroSS'},
    {id: 'nom', title: 'Nom'},
    {id: 'prenom', title: 'Prénom'},
    {id: 'emploie', title: 'Emploie'},
    {id: 'natureContrat', title: 'NatureContrat'},
    {id: 'numeroContrat', title: 'NumeroContrat'},
    {id: 'heuresReference', title: 'HeuresRéf'},
    {id: 'heuresSalaries', title: 'HeuresSal'},
    {id: 'tauxAt', title: 'Taux AT'},

    {id: 'dateDebutContrat', title: 'DateDebutContrat'},
    {id: 'statut', title: 'Statut'},
    {id: 'dispositif', title: 'Dispositif'},
    {id: 'dateFinPrevisionnelle', title: 'DateFinPrevisionnelle'},
    {id: 'uniteMesure', title: 'UniteMesure'},
    {id: 'modaliteTemps', title: 'ModalitéTemps'},
  ]

  const salariesDateDebutContrat = 'S21.G00.40.001'
  const salariesSatut = 'S21.G00.40.002'
  const salariesDispositif = 'S21.G00.40.008'
  const salariesDateFinPrevisionnelle = 'S21.G00.40.010'
  const salariesUniteMesure = 'S21.G00.40.011'
  const salariesModaliteTemps = 'S21.G00.40.014'


  const remunerationHeader = [
    {id: 'mois',  title: 'Mois'},
    {id: 'siren', title: 'Siren'},
    {id: 'nic',   title: 'Nic'},
    {id: 'numeroSS', title: 'NuméroSS'},
    {id: 'periode', title: 'Periode'},
    {id: 'numeroContrat', title: 'NumeroContrat'},
    {id: 'typeBase', title: 'TypeBase'},
    {id: 'montantBase', title: 'MontantBase'},
  ]

  const baseAssujettieHeader = [
    {id: 'mois',  title: 'Mois'},
    {id: 'siren', title: 'Siren'},
    {id: 'nic',   title: 'Nic'},
    {id: 'numeroSS', title: 'NuméroSS'},
    {id: 'codeBase', title: 'CodeBase'},
    {id: 'periode', title: 'Periode'},
    {id: 'base', title: 'Base'},
    {id: 'numeroContrat', title: 'NumeroContrat'},
  ]

  const composantBaseAssujettieHeader = [
    {id: 'mois',  title: 'Mois'},
    {id: 'siren', title: 'Siren'},
    {id: 'nic',   title: 'Nic'},
    {id: 'numeroSS', title: 'NuméroSS'},
    {id: 'periode', title: 'Periode'},
    {id: 'numeroContrat', title: 'NumeroContrat'},

    {id: 'base', title: 'CodeBase'},
    {id: 'montantBase', title: 'Base'},
  ]

  const cotisationIndividuelleHeader = [
    {id: 'mois',  title: 'Mois'},
    {id: 'siren', title: 'Siren'},
    {id: 'nic',   title: 'Nic'},
    {id: 'numeroSS', title: 'NuméroSS'},
    {id: 'periode', title: 'Periode'},
    {id: 'numeroContrat', title: 'NumeroContrat'},
    {id: 'codeCotisation', title: 'CodeCotisation'},
    {id: 'assiette', title: 'Assiette'},
    {id: 'cotisation', title: 'Cotisation'},
  ]

  writeRecords('results/' + currentMonth + '_' + currentEntreprise + '_versement.csv', versements, versementHeader);
  writeRecords('results/' + currentMonth + '_' + currentEntreprise + '_borderaux.csv', bordereaux, bordereauxHeader);
  writeRecords('results/' + currentMonth + '_' + currentEntreprise + '_cotisationAgregees.csv', cotisationAgregees, cotisationAgregeesHeader);
  writeRecords('results/' + currentMonth + '_' + currentEntreprise + '_salaries.csv', salaries, salariesHeader);
  writeRecords('results/' + currentMonth + '_' + currentEntreprise + '_remuneration.csv', remuneration, remunerationHeader);
  writeRecords('results/' + currentMonth + '_' + currentEntreprise + '_baseAssujettie.csv', baseAssujettie, baseAssujettieHeader);
  writeRecords('results/' + currentMonth + '_' + currentEntreprise + '_composantBaseAssujettie.csv', composantBaseAssujettie, composantBaseAssujettieHeader);
  writeRecords('results/' + currentMonth + '_' + currentEntreprise + '_cotisationIndividuelle.csv', cotisationIndividuelle, cotisationIndividuelleHeader);
});

function writeRecords(path, data, header){
  const csvWriter = createCsvWriter({
    path: path,
    header: header
  });
 
  csvWriter.writeRecords(data)
    .then(() => {
        console.log('...Done');
    }).catch((e)=> {
      console.log(e);
    });
}
