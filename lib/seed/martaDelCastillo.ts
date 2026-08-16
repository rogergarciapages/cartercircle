import { CaseData } from '../types/case';

export const MARTA_DEL_CASTILLO_CASE: CaseData = {
  id: 'marta-del-castillo-2009',
  name: 'Marta del Castillo',
  description: 'Análisis geoespacial de espacio de decisión y perimetración probabilística en la desaparición de Marta del Castillo (Sevilla, 2009).',
  status: 'JUDICIAL_OPEN',
  createdAt: '2009-01-24T00:00:00.000Z',
  anchorPoints: [
    {
      id: 'anchor-leon-xiii',
      caseId: 'marta-del-castillo-2009',
      label: 'Escena del Crimen (Calle León XIII, Bajo C)',
      type: 'CRIME_SCENE',
      lat: 37.4042,
      lng: -5.9861,
      weight: 1.0,
      notes: 'Piso donde ocurrieron los hechos según la sentencia. Punto principal de inicio para el cálculo de isócronas y ventana de traslado.',
      sourceRef: 'Sentencia de la Audiencia Provincial de Sevilla (Sección 7ª)'
    },
    {
      id: 'anchor-marta-home',
      caseId: 'marta-del-castillo-2009',
      label: 'Domicilio de Marta (Tartessos / San Carlos)',
      type: 'HOME',
      lat: 37.3995,
      lng: -5.9721,
      weight: 0.7,
      notes: 'Lugar habitual de Marta del Castillo y punto de recogida en ciclomotor.',
      sourceRef: 'Sumario de instrucción'
    },
    {
      id: 'anchor-miguel-home',
      caseId: 'marta-del-castillo-2009',
      label: 'Domicilio / Entorno de Miguel Carcaño (Camas)',
      type: 'HOME',
      lat: 37.4011,
      lng: -6.0335,
      weight: 0.8,
      notes: 'Vivienda de la novia/entorno de Miguel Carcaño en Camas, nodo recurrente de movilidad.',
      sourceRef: 'Declaraciones e informes de telefonía'
    },
    {
      id: 'anchor-dseda',
      caseId: 'marta-del-castillo-2009',
      label: 'Bar DSeda (Distrito Macarena)',
      type: 'LEISURE',
      lat: 37.3958,
      lng: -5.9812,
      weight: 0.5,
      notes: 'Establecimiento mencionado por los implicados durante la franja nocturna posterior.',
      sourceRef: 'Declaraciones de testigos en el juicio'
    },
    {
      id: 'anchor-samuel-home',
      caseId: 'marta-del-castillo-2009',
      label: 'Entorno de Samuel Benítez (Montequinto / Sevilla)',
      type: 'OTHER',
      lat: 37.3920,
      lng: -5.9780,
      weight: 0.4,
      notes: 'Punto ancla secundario de desplazamiento y coartada inicial.',
      sourceRef: 'Declaraciones judiciales'
    }
  ],
  timelineEvents: [
    {
      id: 'event-recogida',
      caseId: 'marta-del-castillo-2009',
      timestamp: '2009-01-24T17:30:00.000Z',
      timeConfidence: 'testimonial',
      description: 'Marta sale de su domicilio y es recogida por Miguel Carcaño en su ciclomotor.',
      personsInvolved: ['Marta del Castillo', 'Miguel Carcaño'],
      locationRefId: 'anchor-marta-home',
      sourceRef: 'Testimonios de familiares y amigos / Sumario'
    },
    {
      id: 'event-crimen-leon-xiii',
      caseId: 'marta-del-castillo-2009',
      timestamp: '2009-01-24T20:28:00.000Z',
      timeConfidence: 'testimonial',
      description: 'Hecho crítico estimado en el piso de la calle León XIII según posicionamiento telefónico y versiones parciales.',
      personsInvolved: ['Marta del Castillo', 'Miguel Carcaño'],
      locationRefId: 'anchor-leon-xiii',
      sourceRef: 'Informes de posicionamiento de antenas de telefonía'
    },
    {
      id: 'event-traslado-sentencia',
      caseId: 'marta-del-castillo-2009',
      timestamp: '2009-01-24T21:45:00.000Z',
      timeConfidence: 'confirmed',
      description: 'Franja judicialmente estimada para el traslado y ocultación del cuerpo desde León XIII (entre 21:00 y a lo sumo 22:15h).',
      personsInvolved: ['Miguel Carcaño', 'Cómplice(s) según resolución'],
      locationRefId: 'anchor-leon-xiii',
      sourceRef: 'Sentencia de la Audiencia Provincial de Sevilla'
    },
    {
      id: 'event-movimientos-hermanastro',
      caseId: 'marta-del-castillo-2009',
      timestamp: '2009-01-24T23:30:00.000Z',
      timeConfidence: 'testimonial',
      description: 'Movimientos posteriores declarados (paradas en bar DSeda, desplazamientos urbanos).',
      personsInvolved: ['Francisco Javier Delgado', 'Samuel Benítez'],
      locationRefId: 'anchor-dseda',
      sourceRef: 'Declaraciones judiciales / Documental'
    },
    {
      id: 'event-hipotesis-vehiculo-tercero',
      caseId: 'marta-del-castillo-2009',
      timestamp: '2009-01-25T02:00:00.000Z',
      timeConfidence: 'hypothesis',
      description: 'Hipótesis de traslado en vehículo de cuatro ruedas hacia perímetro rural o masa de agua fuera del casco urbano.',
      personsInvolved: ['Miguel Carcaño', 'Terceros no identificados'],
      locationRefId: 'anchor-leon-xiii',
      sourceRef: 'Análisis periodístico e hipótesis de acusación particular'
    }
  ],
  pointsOfInterest: [
    {
      id: 'poi-guadalquivir',
      caseId: 'marta-del-castillo-2009',
      label: 'Río Guadalquivir (Pasarela de la Cartuja / Charco de la Pava)',
      type: 'RIVER',
      lat: 37.3950,
      lng: -6.0020,
      notes: 'Lugar de primera versión confesional de arrojamiento al río. Extensamente rastreado.',
      sourceRef: 'Primera versión de Miguel Carcaño (Febrero 2009)'
    },
    {
      id: 'poi-vertedero-utrera',
      caseId: 'marta-del-castillo-2009',
      label: 'Vertedero de Montemarta-Corda (Utrera)',
      type: 'WASTE',
      lat: 37.2150,
      lng: -5.7920,
      notes: 'Destino final de residuos tras la hipótesis del contenedor de basura de León XIII.',
      sourceRef: 'Segunda versión de Miguel Carcaño (Marzo 2009)'
    },
    {
      id: 'poi-majaloba',
      caseId: 'marta-del-castillo-2009',
      label: 'Finca Majaloba (La Rinconada)',
      type: 'OPEN_FIELD',
      lat: 37.4520,
      lng: -5.9620,
      notes: 'Finca agrícola indicada en la 7ª versión de Miguel Carcaño.',
      sourceRef: 'Declaración judicial de Miguel Carcaño (2013)'
    },
    {
      id: 'poi-contenedores-leon-xiii',
      caseId: 'marta-del-castillo-2009',
      label: 'Contenedores de basuras C/ León XIII',
      type: 'CONTAINER',
      lat: 37.4044,
      lng: -5.9863,
      notes: 'Contenedores situados a menos de 50 metros del portal del piso.',
      sourceRef: 'Diligencias de reconstrucción policial'
    }
  ],
  transportProfiles: [
    {
      id: 'trans-walking',
      caseId: 'marta-del-castillo-2009',
      mode: 'WALKING',
      label: 'A pie (con carga)',
      speedKmh: 4.5,
      notes: 'Desplazamiento a pie. Muy limitado en alcance salvo tramos cortos (ej. contenedores próximos).'
    },
    {
      id: 'trans-bicycle',
      caseId: 'marta-del-castillo-2009',
      mode: 'BICYCLE',
      label: 'Bicicleta / Patinete',
      speedKmh: 14.0,
      notes: 'Medio secundario, útil para rastreo de movimientos de vigilancia.'
    },
    {
      id: 'trans-motorcycle',
      caseId: 'marta-del-castillo-2009',
      mode: 'MOTORCYCLE',
      label: 'Ciclomotor / Moto (Miguel Carcaño)',
      speedKmh: 30.0,
      notes: 'Ciclomotor habitual de Miguel Carcaño (25-35 km/h en entramado urbano).'
    },
    {
      id: 'trans-car',
      caseId: 'marta-del-castillo-2009',
      mode: 'CAR',
      label: 'Turismo / Furgoneta (Vehículo de tercero)',
      speedKmh: 40.0,
      notes: 'Vehículo de 4 ruedas (40 km/h medio en ciudad, 80 km/h en SE-30 / rondas de circunvalación).'
    }
  ]
};
