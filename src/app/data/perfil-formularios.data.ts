import { Field } from '../components/formulario/formulario';
export const TYPES = [
  'EDUCACION',
  'EXPERIENCIA',
  'HABILIDAD_TECNICA',
  'HABILIDAD_BLANDA',
  'CERTIFICACION',
  'IDIOMA',
];
export const contactFields: Field[] = [
  {
    key: 'resumenProfesional',
    label: 'Tu perfil profesional',
    type: 'textarea',
    required: true,
    maxLength: 500,
  },
  { key: 'telefono', label: 'Teléfono', required: true, maxLength: 20 },
  { key: 'direccion', label: 'Dirección', required: true, maxLength: 200 },
  { key: 'linkedinUrl', label: 'LinkedIn', type: 'url', maxLength: 200 },
];
export const educationFields: Field[] = [
  { key: 'institucion', label: 'Institución', required: true, maxLength: 150 },
  { key: 'titulo', label: 'Título o carrera', required: true, maxLength: 150 },
  { key: 'campoEstudio', label: 'Campo de estudio', required: true },
  {
    key: 'nivelEducacion',
    label: 'Nivel educativo',
    required: true,
    options: [
      'SECUNDARIA',
      'TECNICO',
      'UNIVERSITARIO_EN_CURSO',
      'BACHILLER',
      'TITULADO',
      'MAESTRIA',
      'DOCTORADO',
    ],
  },
  { key: 'fechaInicio', label: 'Fecha de inicio', type: 'date', required: true },
  { key: 'fechaFin', label: 'Fecha de fin', type: 'date' },
  { key: 'enCurso', label: 'Actualmente estudio aquí', type: 'checkbox' },
];
export const experienceFields: Field[] = [
  { key: 'empresa', label: 'Empresa u organización', required: true, maxLength: 150 },
  { key: 'cargo', label: 'Cargo o actividad', required: true, maxLength: 150 },
  { key: 'descripcion', label: 'Actividades realizadas', type: 'textarea', maxLength: 500 },
  { key: 'fechaInicio', label: 'Fecha de inicio', type: 'date', required: true },
  { key: 'fechaFin', label: 'Fecha de fin', type: 'date' },
  { key: 'actual', label: 'Actualmente participo aquí', type: 'checkbox' },
];
export const skillFields: Field[] = [
  { key: 'nombre', label: 'Competencia, idioma o certificación', required: true, maxLength: 100 },
  { key: 'tipo', label: 'Tipo de competencia', options: TYPES, required: true },
  {
    key: 'nivelDominio',
    label: 'Nivel de dominio',
    required: true,
    options: ['BASICO', 'INTERMEDIO', 'AVANZADO'],
  },
  {
    key: 'aniosExperiencia',
    label: 'Años de experiencia',
    type: 'number',
    min: 0,
    max: 60,
    value: 0,
  },
];
