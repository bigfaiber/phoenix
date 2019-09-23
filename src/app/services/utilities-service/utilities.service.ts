import { Injectable } from '@angular/core';
import { FormControl, AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { DataService } from '../data-service/data.service';

@Injectable()
export class UtilitiesService {

  constructor( private http: Http, private dataService: DataService ) {
    this.auth_token = dataService.auth_token_value
    this.API_path = dataService.API_path
    dataService.auth_token$.subscribe(
      res => {
        this.auth_token = res
      }
    )
    let psets = localStorage.getItem( 'progSettings' )
    if ( psets ) {
      psets = JSON.parse( psets )
      UtilitiesService.debugging = ( <any> psets ).debugging
    }
  }

  API_path: String
  auth_token: String

  public static debugging: Boolean = false

  public static phone_codes = [
    {name:'Abjasia',code:'+7'},
    {name:'Afganistán',code:'+93'},
    {name:'Albania',code:'+355'},
    {name:'Alemania',code:'+49'},
    {name:'Andorra',code:'+376'},
    {name:'Angola',code:'+244'},
    {name:'Anguilla',code:'+1264'},
    {name:'Antigua y Barbuda',code:'+1268'},
    {name:'Antillas Holandesas',code:'+599'},
    {name:'Antártida',code:'+672'},
    {name:'Arabia Saudita',code:'+966'},
    {name:'Argelia',code:'+213'},
    {name:'Argentina',code:'+54'},
    {name:'Armenia',code:'+374'},
    {name:'Aruba',code:'+297'},
    {name:'Australia',code:'+61'},
    {name:'Austria',code:'+43'},
    {name:'Azerbaiyán',code:'+994'},
    {name:'Bahamas',code:'+1242'},
    {name:'Bahrein',code:'+973'},
    {name:'Bangladesh',code:'+880'},
    {name:'Barbados',code:'+1246'},
    {name:'Belice',code:'+501'},
    {name:'Benin',code:'+229'},
    {name:'Bermudas',code:'+1441'},
    {name:'Bielorrusia',code:'+375'},
    {name:'Bolivia',code:'+591'},
    {name:'Bonaire',code:'+599'},
    {name:'Bosnia-Herzegovina',code:'+387'},
    {name:'Botswana',code:'+267'},
    {name:'Brasil',code:'+55'},
    {name:'Brunei Darussalam',code:'+673'},
    {name:'Bulgaria',code:'+359'},
    {name:'Burkina Faso',code:'+226'},
    {name:'Burundi',code:'+257'},
    {name:'Bután',code:'+975'},
    {name:'Bélgica',code:'+32'},
    {name:'Cabo Verde',code:'+238'},
    {name:'Camboya',code:'+855'},
    {name:'Camerún',code:'+237'},
    {name:'Canadá',code:'+1'},
    {name:'Chad',code:'+235'},
    {name:'Chile',code:'+56'},
    {name:'China',code:'+86'},
    {name:'Chipre',code:'+357'},
    {name:'Comores',code:'+269'},
    {name:'Congo',code:'+242'},
    {name:'Congo RD',code:'+243'},
    {name:'Corea del Norte',code:'+850'},
    {name:'Corea del Sur',code:'+82'},
    {name:'Costa de Marfil',code:'+225'},
    {name:'Costa Rica',code:'+506'},
    {name:'Croacia',code:'+385'},
    {name:'Cuba',code:'+53'},
    {name:'Curacao',code:'+599'},
    {name:'Dinamarca',code:'+45'},
    {name:'Dominica',code:'+1767'},
    {name:'Dominicana, República',code:'+1'},
    {name:'Ecuador',code:'+593'},
    {name:'Egipto',code:'+20'},
    {name:'El Salvador',code:'+503'},
    {name:'Emiratos Árabes Unidos',code:'+971'},
    {name:'Eritrea',code:'+291'},
    {name:'Eslovaquia',code:'+421'},
    {name:'Eslovenia',code:'+386'},
    {name:'España',code:'+34'},
    {name:'Estados Unidos',code:'+1'},
    {name:'Estonia',code:'+372'},
    {name:'Etiopía',code:'+251'},
    {name:'Fiji',code:'+679'},
    {name:'Filipinas',code:'+63'},
    {name:'Finlandia',code:'+358'},
    {name:'Francia',code:'+33'},
    {name:'Gabón',code:'+241'},
    {name:'Gambia',code:'+220'},
    {name:'Georgia',code:'+995'},
    {name:'Ghana',code:'+233'},
    {name:'Gibraltar',code:'+350'},
    {name:'Granada',code:'+1473'},
    {name:'Grecia',code:'+30'},
    {name:'Groenlandia',code:'+299'},
    {name:'Guadalupe',code:'+590'},
    {name:'Guam',code:'+1671'},
    {name:'Guatemala',code:'+502'},
    {name:'Guayana francés',code:'+594'},
    {name:'Guernsey',code:'+44'},
    {name:'Guinea Bissau',code:'+245'},
    {name:'Guinea Ecuatorial',code:'+240'},
    {name:'Guyana',code:'+592'},
    {name:'Haiti',code:'+509'},
    {name:'Honduras',code:'+504'},
    {name:'Hong Kong',code:'+852'},
    {name:'Hungría',code:'+36'},
    {name:'India',code:'+91'},
    {name:'Indonesia',code:'+62'},
    {name:'Iran',code:'+98'},
    {name:'Iraq',code:'+964'},
    {name:'Irlanda',code:'+353'},
    {name:'Isla de Man',code:'+44'},
    {name:'Isla De Navidad, Isla Christmas',code:'+61'},
    {name:'Isla de Åland',code:'+358'},
    {name:'Isla Norfolk',code:'+672'},
    {name:'Isla periféricas menores de Estados Unidos',code:'+699'},
    {name:'Islandia',code:'+354'},
    {name:'Islas Caimán',code:'+1345'},
    {name:'Islas Cocos',code:'+61'},
    {name:'Islas Cook',code:'+682'},
    {name:'Islas Feroe',code:'+298'},
    {name:'Islas Malvinas',code:'+500'},
    {name:'Islas Marshall',code:'+692'},
    {name:'Islas Pitcairn',code:'+872'},
    {name:'Islas Salomón',code:'+677'},
    {name:'Islas Turcas y Caicos',code:'+1649'},
    {name:'Islas Vírgenes Británicas',code:'+128'},
    {name:'Islas Vírgenes de EE.UU.',code:'+134'},
    {name:'Israel',code:'+972'},
    {name:'Italia',code:'+39'},
    {name:'Jamaica',code:'+187'},
    {name:'Japón',code:'+81'},
    {name:'Jersey',code:'+44'},
    {name:'Jordania',code:'+962'},
    {name:'Kazajstán',code:'+7'},
    {name:'Kenia',code:'+254'},
    {name:'Kirguistán',code:'+996'},
    {name:'Kiribati',code:'+686'},
    {name:'Kosovo',code:'+377'},
    {name:'Kuwait',code:'+965'},
    {name:'Laos',code:'+856'},
    {name:'Lesotho',code:'+266'},
    {name:'Letonia',code:'+371'},
    {name:'Liberia',code:'+231'},
    {name:'Libia',code:'+218'},
    {name:'Liechtenstein',code:'+423'},
    {name:'Lituania',code:'+370'},
    {name:'Luxemburgo',code:'+352'},
    {name:'Líbano',code:'+961'},
    {name:'Macao',code:'+853'},
    {name:'Macedonia',code:'+389'},
    {name:'Madagascar',code:'+261'},
    {name:'Malasia',code:'+60'},
    {name:'Malawi',code:'+265'},
    {name:'Maldivas',code:'+960'},
    {name:'Malta',code:'+356'},
    {name:'Malí',code:'+223'},
    {name:'Marianas del Norte',code:'+1670'},
    {name:'Marruecos',code:'+212'},
    {name:'Martinica',code:'+596'},
    {name:'Mauricio',code:'+230'},
    {name:'Mauritania',code:'+222'},
    {name:'Mayotte',code:'+262'},
    {name:'Micronesia',code:'+691'},
    {name:'Moldavia',code:'+373'},
    {name:'Mongolia',code:'+976'},
    {name:'Montenegro',code:'+382'},
    {name:'Montserrat',code:'+1664'},
    {name:'Mozambique',code:'+258'},
    {name:'Myanmar',code:'+95'},
    {name:'México',code:'+52'},
    {name:'Mónaco',code:'+377'},
    {name:'Namibia',code:'+264'},
    {name:'Nauru',code:'+674'},
    {name:'Nepal',code:'+977'},
    {name:'Nicaragua',code:'+505'},
    {name:'Nigeria',code:'+234'},
    {name:'Niue',code:'+683'},
    {name:'Noruega',code:'+47'},
    {name:'Nueva Caledonia',code:'+687'},
    {name:'Nueva Zelanda',code:'+64'},
    {name:'Níger',code:'+227'},
    {name:'Omán',code:'+968'},
    {name:'Pakistán',code:'+92'},
    {name:'Palau',code:'+680'},
    {name:'Palestina',code:'+970'},
    {name:'Panamá',code:'+507'},
    {name:'Papúa-Nueva Guinea',code:'+675'},
    {name:'Paraguay',code:'+595'},
    {name:'Países Bajos, Holanda',code:'+31'},
    {name:'Perú',code:'+51'},
    {name:'Polinesia Francesa',code:'+689'},
    {name:'Polonia',code:'+48'},
    {name:'Portugal',code:'+351'},
    {name:'Puerto Rico',code:'+1'},
    {name:'Qatar',code:'+974'},
    {name:'Reino Unido',code:'+44'},
    {name:'República Centroafricana',code:'+236'},
    {name:'República Checa',code:'+420'},
    {name:'República Guinea',code:'+224'},
    {name:'Reunión',code:'+262'},
    {name:'Ruanda',code:'+250'},
    {name:'Rumanía',code:'+40'},
    {name:'Rusia',code:'+7'},
    {name:'Samoa',code:'+685'},
    {name:'Samoa Americana',code:'+1684'},
    {name:'San Cristóbal y Nevis',code:'+1869'},
    {name:'San Marino',code:'+378'},
    {name:'San Martin',code:'+590'},
    {name:'San Pedro y Miquelón',code:'+508'},
    {name:'San Vincente y Granadinas',code:'+1784'},
    {name:'Santa Helena',code:'+290'},
    {name:'Santa Lucía',code:'+1758'},
    {name:'Santo Tomé y Príncipe',code:'+239'},
    {name:'Senegal',code:'+221'},
    {name:'Serbia',code:'+381'},
    {name:'Seychelles',code:'+248'},
    {name:'Sierra Leona',code:'+232'},
    {name:'Singapur',code:'+65'},
    {name:'Siria',code:'+963'},
    {name:'Somalilandia',code:'+252'},
    {name:'Somalía',code:'+252'},
    {name:'Sri Lanka',code:'+94'},
    {name:'Sudáfrica',code:'+27'},
    {name:'Sudán',code:'+249'},
    {name:'Sudán del Sur',code:'+211'},
    {name:'Suecia',code:'+46'},
    {name:'Suiza',code:'+41'},
    {name:'Surinam',code:'+597'},
    {name:'Svalbard y Jan Mayen',code:'+47'},
    {name:'Swazilandia',code:'+268'},
    {name:'Sáhara Occidental',code:'+212'},
    {name:'Tadjikistan',code:'+992'},
    {name:'Tailandia',code:'+66'},
    {name:'Taiwán',code:'+886'},
    {name:'Tanzania',code:'+255'},
    {name:'Territorio Británico del Océano Índico.',code:'+246'},
    {name:'Territorios Franceses del Sur',code:'+262'},
    {name:'Timor del Este',code:'+670'},
    {name:'Togo',code:'+228'},
    {name:'Tokelau',code:'+690'},
    {name:'Tonga',code:'+676'},
    {name:'Trinidad y Tobago',code:'+1868'},
    {name:'Turkmenistán',code:'+993'},
    {name:'Turquía',code:'+90'},
    {name:'Tuvalu',code:'+688'},
    {name:'Túnez',code:'+216'},
    {name:'Ucrania',code:'+380'},
    {name:'Uganda',code:'+256'},
    {name:'Uruguay',code:'+598'},
    {name:'Uzbekistán',code:'+998'},
    {name:'Vanuatu',code:'+678'},
    {name:'Vaticano',code:'+379'},
    {name:'Venezuela',code:'+58'},
    {name:'Vietnam',code:'+84'},
    {name:'Wallis y Futuna',code:'+681'},
    {name:'Yemen',code:'+967'},
    {name:'Yibuti',code:'+253'},
    {name:'Zambia',code:'+260'},
    {name:'Zimbábue',code:'+263'},
  ]

  getAverageInterest( ) {
    return this.http.get( this.API_path + '/average-interest' )
        .map( ( res: Response ) => res )
  }

  static emptySelectTagValidator( control: FormControl ) {
      if ( control.value == "0" )
          return {
              emptySelect: true
          }
      return null
  }

  static matchPasswordValidator( AC: AbstractControl ) {
      let password = AC.get( 'password' ).value
      let password_confirmation = AC.get( 'password_confirmation' ).value
      if ( password != password_confirmation ) {
          AC.get( 'password_confirmation' ).setErrors({
              passwordMatch: true
          })
      }
      else {
          return null
      }
  }

  static elementInViewport( el, p ) {
    var top = el.offsetTop;
    var left = el.offsetLeft;
    var width = el.offsetWidth;
    var height = el.offsetHeight;

    while( el.offsetParent ) {
      el = el.offsetParent;
      top += el.offsetTop;
      left += el.offsetLeft;
    }

    return (
      top >= window.pageYOffset &&
      left >= window.pageXOffset &&
      ( top + height * p ) <= ( window.pageYOffset + window.innerHeight ) &&
      ( left + width ) <= ( window.pageXOffset + window.innerWidth )
    );
  }

  shareFacebook( ) {
      ( <any> window ).ga( 'send', 'event', {
        eventCategory: 'sharing',
        eventAction: 'facebook share'
      });
      window.open(
          'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fphx.com.co',
          'popup',
          'width=600,height=600'
      )
  }

  shareWhatsapp( ) {
      ( <any> window ).ga( 'send', 'event', {
        eventCategory: 'sharing',
        eventAction: 'whatsapp share'
      });
      window.open(
          'https://api.whatsapp.com/send?text=Ingresa%20Ahora%21%20https%3A%2F%2Fphx.com.co',
          'popup',
          'width=600,height=600'
      )
  }

  shareTwitter( ) {
      ( <any> window ).ga( 'send', 'event', {
        eventCategory: 'sharing',
        eventAction: 'twitter share'
      });
      window.open(
          'https://twitter.com/intent/tweet?url=https%3A%2F%2Fphx.com.co&text=Ingresa%20Ahora%21',
          'popup',
          'width=600,height=600'
      )
  }

  static allDocumentsComplete( user_data ) {
     var statements_doc_counter = 0
     var id_doc_counter = 0
     var rent_doc_counter = 0
     var incomes_doc_counter = 0

     for ( var i = 0; i < user_data.documents.length; i++ )
         if ( user_data.documents[ i ].document_type == "extractos" ) {
             statements_doc_counter = 1
             break
         }

     for ( var i = 0; i < user_data.documents.length; i++ )
         if ( user_data.documents[ i ].document_type == "cc" ) {
             id_doc_counter = 1
             break
         }

     for ( var i = 0; i < user_data.documents.length; i++ )
         if ( user_data.documents[ i ].document_type == "ingresos" ) {
             incomes_doc_counter = 1
             break
         }

     for ( var i = 0; i < user_data.documents.length; i++ )
         if ( user_data.documents[ i ].document_type == "renta" ) {
             rent_doc_counter = 1
             break
         }

     let sum = statements_doc_counter + id_doc_counter + rent_doc_counter + incomes_doc_counter
     return ( sum < 4 && user_data.rent_tax ) || ( sum < 3 && !user_data.rent_tax )
  }

  static missingAccount( user_data ) {
    let cnt = 0
    user_data.projects.forEach( x => {
      if ( !x.finished && x.inv_account == null )
        cnt++
    })
    return cnt
  }

  static debugSwitch( flag: Boolean ) {
    UtilitiesService.debugging = flag

    let psets: any = localStorage.getItem( 'progSettings' )
    if ( psets ) {
      psets = JSON.parse( psets )
      psets.debugging = UtilitiesService.debugging
      localStorage.setItem( 'progSettings', JSON.stringify( psets ) )
    } else {
      localStorage.setItem( 'progSettings', JSON.stringify({
        debugging: UtilitiesService.debugging
      }))
    }
  }

  static debug( ...obj ) {
    if ( UtilitiesService.debugging ) {
      obj.forEach( x => {
        console.log( x )
      })
    }
  }

  static getFormValidationErrors( form: FormGroup ) {
    Object.keys( form.controls ).forEach( key => {
      const controlErrors: ValidationErrors = form.get( key ).errors;
      if ( controlErrors != null ) {
        Object.keys( controlErrors ).forEach( keyError => {
          console.log( 'Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[ keyError ] );
        });
      }
    });
  }

}
