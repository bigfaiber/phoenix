import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { trigger, state, style, animate, transition, stagger, query, keyframes } from '@angular/animations';
import { UtilitiesService } from '../../../services/utilities-service/utilities.service'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  // encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('faqState', [
      transition(':enter', [
        style({opacity:0,height:0,transform:'translateX(-100%)'}),
        animate('200ms 200ms', style({opacity:1,height:'*',transform:'translateX(0)'}))
      ]),
      transition(':leave', [
        animate(200, style({opacity:0,transform:'translateX(100%)'}))
      ])
    ]),
    trigger('arrowState', [
      state('visible', style({transform:'rotateX(180deg)'})),
      state('hidden', style({transform:'rotateX(0deg)'})),
      transition('visible => hidden', [
        animate( 200, style({transform:'rotateX(0deg)'}) ),
      ]),
      transition('hidden => visible', [
        animate( 200, style({transform:'rotateX(180deg)'}) ),
      ])
    ]),
    trigger('dropAnim', [
      transition(':enter', [
        style({opacity:0,height:0}),
        animate(200, style({opacity:1,height:'*'}))
      ]),
      transition(':leave', [
        animate(200, style({opacity:0,height:0}))
      ])
    ]),
  ]
})
export class FooterComponent implements OnInit {

  constructor( public uService: UtilitiesService ) { }

  qs_img_on: String = 'assets/images/faq/PF_quienes_on.png'
  qs_img_off: String = 'assets/images/faq/PF_quienes_off.png'

  cl_img_on: String = 'assets/images/faq/PF_cliente_on.png'
  cl_img_off: String = 'assets/images/faq/PF_cliente_off.png'

  in_img_on: String = 'assets/images/faq/PF_inver_on.png'
  in_img_off: String = 'assets/images/faq/PF_inver_off.png'

  faqs = [
      {
          state: 'showing',
          imgPath: this.qs_img_on
      },
      {
          state: 'hidden',
          imgPath: this.cl_img_off
      },
      {
          state: 'hidden',
          imgPath: this.in_img_off
      }
  ]

  aboutUsFaq = [
    {
      question: "¿Qué hace Phoenix?",
      text: `
      ¡Es muy simple! Nosotros ponemos en contacto directo, personas que tienen dinero con personas
      que necesitan dinero. De esta manera al no tener intermediarios como bancos o comisionistas, las
      personas que invierten tienen una muy buena tasa de retorno y las personas que solicitan el
      dinero, tienen una tasa competitiva.<br><br>
      `,
      visible: 'hidden'
    },
    {
      question: "¿Esto es legal?",
      text: `
      Sí. el nombre técnico de nuestra actividad, se llama corretaje, que esta establecido en el articulo
      1340 del código de comercio que expresa:
      <span class="italic">
        "se llama corredor a la persona que, por su especial conocimiento de los mercados, se ocupa como
        agente intermediario en la tarea de poner en relación dos o mas personas, con el fin de que
        celebren un negocio comercial, sin estar vinculado a las partes por relaciones de colaboración,
        dependencia, mandato o representación."
      </span><br><br>
      `,
      visible: 'hidden'
    },
    {
      question: "¿Esto es captación de dinero?",
      text: `
      No. Phoenix ni sus empleados están autorizados para recibir ningún dinero de parte de ningún
      inversionista en ningún caso. Phoenix cobra a sus clientes por el concepto de corretaje, pero nunca
      recibe dinero para ser invertido en representación propia o de terceros. El inversionista escoge sus
      propios negocios y transfiere los fondos directamente a las personas que hacen uso de ellos. Esto
      se denomina contrato de mutuo.<br><br>
      `,
      visible: 'hidden'
    },
    {
      question: "¿Esto es una pirámide?",
      text: `
      No. Nuestra actividad está dentro del marco legal del código de comercio y no participamos en
      actividades de captación masiva de dinero, ni de intermediación financiera. Así mismo no le damos
      ningún tipo de ganancia a clientes o inversionistas por promover nuestros servicios.<br><br>
      `,
      visible: 'hidden'
    },
    {
      question: "¿Están vigilados por la super intendencia financiera?",
      text: `
      No, ya que nuestra actividad no es <span class="italic">captación de dinero</span> ni
      <span class="italic">intermediación financiera</span>. Nosotros no somos sujetos a vigilancia por
      parte de éste ente de control.<br><br>
      `,
      visible: 'hidden'
    },
    {
      question: "¿Esto es Crowdfunding?",
      text: `
      No. Crowdfunding es cuando muchos inversionistas o personas invierten en un solo proyecto productivo.
      Phoenix tiene un modelo P2P Lending. Esto significa que una persona le presta dinero a otra persona en
      calidad de libre inversión a cambio de unos intereses sobre una tasa dentro de los topes legales vigentes.<br><br>
      `,
      visible: 'hidden'
    }
  ]

  customerFaq = [
    {
      question: "¿A mí me presta Phoenix?",
      text: `
      No, Phoenix es una plataforma donde personas que tienen dinero encuentran personas que
      necesitan dinero. El préstamo los hace directamente un tercero.<br><br>
      `,
      visible: 'hidden'
    },
    {
      question: "¿Esto es legal?",
      text: `
      Sí. el nombre técnico de nuestra actividad, se llama corretaje, que esta establecido en el articulo
      1340 del código de comercio que expresa:
      <span class="italic">
        "se llama corredor a la persona que, por su especial conocimiento de los mercados, se ocupa como
        agente intermediario en la tarea de poner en relación dos o mas personas, con el fin de que
        celebren un negocio comercial, sin estar vinculado a las partes por relaciones de colaboración,
        dependencia, mandato o representación."
      </span><br><br>
      `,
      visible: 'hidden'
    },
    {
      question: "¿A qué tasa de interés me prestan?",
      text: `
      La tasa de interés depende de ti. Phoenix genera un análisis sobre toda la información financiera
      que se te pide. De esta manera tu perfil queda clasificado en una escala de 0 a 100. Si estás por
      encima de 60 puedes presentar tu negocio y a medida que tu calificación se va aumentando, tu
      tasa de interés es más baja.<br><br>
      `,
      visible: 'hidden'
    },
    {
      question: "¿Puedo mejorar mi calificación?",
      text: `
      Sí. Una vez consigas tu financiación y pagues cumplido, tu calificación mejorará progresivamente.
      Así mismo, si eres incumplido tu calificación bajará, y esta información será la que los
      inversionistas vean.<br><br>
      `,
      visible: 'hidden'
    },
    {
      question: "¿Por qué me negarían un préstamo?",
      text: `
      Phoenix maneja mas de 17 variables diferentes para analizar tu comportamiento financiero. Pero
      las razones más comunes para negar un préstamo son las siguientes:

      <ul>
        <li>
          Ya estás muy endeudado.
        </li>
        <li>
          Presentas mal comportamiento el sector crediticio.
        </li>
        <li>
          La información que proveíste no coincide con la realidad.
        </li>
        <li>
          La cantidad de dinero que pides excede tu capacidad de endeudamiento.
        </li>
        <li>
          Tu planeación financiera no es viable.
        </li>
        <li>
          Te encuentras en alguna lista restrictiva.
        </li>
        <li>
          Que tu sueño puede comprometer tu capacidad de pago.
        </li>
      </ul>

      <br><br>
      `,
      visible: 'hidden'
    },
    {
      question: "¿Qué pasa si no pago?",
      text: `
      Al hacer un negocio requerimos que proveas unas garantías. Al momento del impago la persona
      que te hizo el préstamo ejecutará las garantías. Esto se traduce en embargo sobre cuentas
      bancarias, salarios y activos que tengas. Adicional estarías dañando la calidad de vida de la
      persona que depositó su confianza en ti.<br><br>
      `,
      visible: 'hidden'
    },
    {
      question: "¿Esto es Crowdfunding?",
      text: `
      No. Crowdfunding es cuando muchos inversionistas o personas invierten en un solo proyecto productivo.
      Phoenix tiene un modelo P2P Lending. Esto significa que una persona le presta dinero a otra persona en
      calidad de libre inversión a cambio de unos intereses sobre una tasa dentro de los topes legales vigentes.<br><br>
      `,
      visible: 'hidden'
    }
  ]

  investorFaq = [
    {
      question: "¿Qué pasa si presto y no me pagan?",
      text: `
      En cada negocio, se generan garantías (pagares, prendas, hipotecas). De esta manera si el cliente
      entra en impago, se ejecutarían las garantías. El costo de ejecución de éstas, van por cuenta del
      inversionista. Éstos generalmente se suman al cobro jurídico y son asumidos por el cliente al cuál
      le prestaste.<br><br>
      `,
      visible: 'hidden'
    },
    {
      question: "¿Esto es legal?",
      text: `
      Sí. el nombre técnico de nuestra actividad, se llama corretaje, que esta establecido en el articulo
      1340 del código de comercio que expresa:
      <span class="italic">
        "se llama corredor a la persona que, por su especial conocimiento de los mercados, se ocupa como
        agente intermediario en la tarea de poner en relación dos o mas personas, con el fin de que
        celebren un negocio comercial, sin estar vinculado a las partes por relaciones de colaboración,
        dependencia, mandato o representación."
      </span><br><br>
      `,
      visible: 'hidden'
    },
    {
      question: "¿Esto es captación de dinero?",
      text: `
      No. Phoenix ni sus empleados están autorizados para recibir ningún dinero de parte de ningún
      inversionista en ningún caso. Phoenix cobra a sus clientes por el concepto de corretaje, pero nunca
      recibe dinero para ser invertido en representación propia o de terceros. El inversionista escoge sus
      propios negocios y transfiere los fondos directamente a las personas que hacen uso de ellos. Esto
      se denomina contrato de mutuo.<br><br>
      `,
      visible: 'hidden'
    },
    {
      question: "¿Phoenix no asume los costos judiciales?",
      text: `
      Los inversionistas son los que escogen el negocio, son los que deciden que cantidad de riesgo
      quieren tomar, y obtienen el 100% de la rentabilidad de éste. Por lo tanto, ellos son responsables
      de los costos iniciales de un cobro jurídico sobre garantías.<br><br>
      En un caso donde exista un proceso judicial, Phoenix proveerá toda la información del deudor para
      facilitar la acción ejecutiva, y bloqueará al mismo de la plataforma.<br><br>
      `,
      visible: 'hidden'
    },
    {
      question: "¿Cómo hago mi inversión?",
      text: `
      Cuando escoges el negocio en el cual quieres invertir, Phoenix se encarga de generar la
      documentación, (pagares, contratos, garantías) todo lo que necesitas para que esté legalizado.
      Una vez estos documentos están debidamente diligenciados por el cliente, Phoenix te notifica y así
      haces transferencia directamente a la cuenta del cliente. El pago se genera de la misma manera, el
      cliente mensualmente te transfiere directamente a tu cuenta.<br><br>
      `,
      visible: 'hidden'
    },
    {
      question: "¿Prestar en Phoenix es riesgoso?",
      text: `
      En todos los negocios existe el riesgo. En Phoenix los identificamos y los clasificamos. Cada
      inversionista dependiendo de la relación riesgo-rentabilidad que quiera, escoge el negocio. A
      mayor rentabilidad, mayor riesgo, y cuando decimos riesgo, puede ser una persona joven que
      apenas está empezando su carrera laboral, o una persona que solo tenga una fuente de ingreso o
      simplemente es el primer negocio que hace a través de nuestra plataforma. Cualquiera que sea el
      caso, no significa que sean malos clientes.<br><br>
      Cabe establecer que Phoenix filtra rigurosamente todos sus candidatos a través de matrices de riesgo propias
      y permite que personas que cumplan características mínimas de
      seguridad, entren a la plataforma.<br><br>
      `,
      visible: 'hidden'
    },
    {
      question: "¿Cómo evalúan a los clientes?",
      text: `
      Tenemos un proceso riguroso de evaluación, los clientes deben enviar toda su información
      financiera, como certificación de ingresos, declaración de renta y movimientos bancarios. Además,
      cruzamos información con centrales de riesgo para ver su historial crediticio con los bancos, y que
      no se encuentren en alguna lista restrictiva como la lista Clinton. Por último, tomamos toda esta
      información y le aplicamos filtros de seguridad propios, para poder encontrar los clientes que
      valen la pena.<br><br>
      `,
      visible: 'hidden'
    },
    {
      question: "¿Puedo pedirle al banco prestado y poner ese dinero en Phoenix a trabajar?",
      text: `
      No lo recomendamos, ya que  Phoenix se diseñó para poder invertir excedentes de capital (ahorros), es decir
      dinero que no es esencial para tu bienestar y por lo cual estas dispuesto a asumir un riesgo.<br><br>
      Por lo tanto, si inviertes ahorros, y tu cliente se demora con el pago, no impactara tu calidad de vida,
      mientras que si inviertes un préstamo y tu cliente se demora, quedas expuesto a las cobranzas de la entidad que
      te presto los recursos.<br><br>
      `,
      visible: 'hidden'
    },
    {
      question: "¿Cuál es el límite que puedo prestar en Phoenix?",
      text: `
      Esto depende de tu patrimonio. Una vez Phoenix verifica el tamaño de tu patrimonio y el origen de tus recursos,
      asigna un cupo máximo de 30% de este. Es decir, si tu patrimonio es de 100 millones, solo podrás prestar hasta 30
      millones. Esto se hace con el fin de proteger al inversionista ya que prestar dinero es una actividad de riesgo,
      y debe ser tomada consiente de esto. Si quieres prestar más de este porcentaje, debes firmar un documento donde
      reconoces los riesgos de ir más allá del límite aconsejado por Phoenix.<br><br>
      `,
      visible: 'hidden'
    },
    {
      question: "¿Hay alguna razón por la que no me dejen invertir en Phoenix?",
      text: `
      Así como filtramos a nuestros clientes, también verificamos a los inversionistas. Buscamos establecer
      que sus capitales tengan origen lícito además de conocer el tamaño real del patrimonio para establecer
      el límite de cuanto puede invertir en Phoenix. Las razones para que se rechace un inversionista puede ser,
      inconsistencia en la información suministrada, o incapacidad de determinar el origen de los recursos.<br><br>
      `,
      visible: 'hidden'
    },
    {
      question: "¿Los empleados de Phoenix pueden pedir prestado en la plataforma?",
      text: `
      No, los empleados de Phoenix no están habilitados para proponer negocios en la plataforma, ya que se
      podría incurrir en un conflicto de intereses. Los que proponen negocios son clientes, que son terceros
      sin relación con Phoenix.<br><br>
      `,
      visible: 'hidden'
    },
    {
      question: "¿Si el cliente se demora en el pago, debo llamarlo yo a cobrarle?",
      text: `
      En la tarifa que el inversionista paga, se encuentra el servicio de acompañamiento, este consiste en
      recordarle al cliente 24 horas antes de su fecha de corte el pago que debe hacer, y en caso de mora,
      incrementar el número de llamadas para persuadirlo que genere el pago. Esto se mantendrá hasta que  el cliente
      pague o se cumpla el término de tiempo para iniciar cobro con abogado.<br><br>
      `,
      visible: 'hidden'
    },
    {
      question: "¿Esto es Crowdfunding?",
      text: `
      No. Crowdfunding es cuando muchos inversionistas o personas invierten en un solo proyecto productivo.
      Phoenix tiene un modelo P2P Lending. Esto significa que una persona le presta dinero a otra persona en
      calidad de libre inversión a cambio de unos intereses sobre una tasa dentro de los topes legales vigentes.<br><br>
      `,
      visible: 'hidden'
    }
  ]

  year: number = 2017

  ngOnInit( ) {
    this.year = ( new Date( ) ).getFullYear( )
  }

  faqSelection( index ) {
      switch ( index ) {
          case 0:
              this.faqs[ 0 ] = {
                  state: 'showing',
                  imgPath: this.qs_img_on
              }
              this.faqs[ 1 ] = {
                  state: 'hidden',
                  imgPath: this.cl_img_off
              }
              this.faqs[ 2 ] = {
                  state: 'hidden',
                  imgPath: this.in_img_off
              }
              break
          case 1:
              this.faqs[ 1 ] = {
                  state: 'showing',
                  imgPath: this.cl_img_on
              }
              this.faqs[ 0 ] = {
                  state: 'hidden',
                  imgPath: this.qs_img_off
              }
              this.faqs[ 2 ] = {
                  state: 'hidden',
                  imgPath: this.in_img_off
              }
              break
          case 2:
              this.faqs[ 2 ] = {
                  state: 'showing',
                  imgPath: this.in_img_on
              }
              this.faqs[ 1 ] = {
                  state: 'hidden',
                  imgPath: this.cl_img_off
              }
              this.faqs[ 0 ] = {
                  state: 'hidden',
                  imgPath: this.qs_img_off
              }
              break
      }
  }

  clickHandler( index, array ) {
    array[ index ].visible = array[ index ].visible == 'visible' ? 'hidden' : 'visible'
    for ( let i = 0; i < array.length; i++ ) {
      if ( i != index )
        array[ i ].visible = 'hidden'
    }
  }

}
