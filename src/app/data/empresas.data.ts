import { Company } from '../models/empresa';

export const COMPANIES: readonly Company[] = [
  {
    slug: 'alicorp',
    name: 'Alicorp',
    aliases: ['Alicorp', 'Alicorp SAA', 'Alicorp S.A.A.'],
    sector: 'Alimentos y consumo',
    description:
      'Compañía con negocios de alimentos, cuidado del hogar y cuidado personal, además de soluciones para otras industrias.',
    website: 'https://www.alicorp.com.pe/pe/es',
    logo: '/images/companies/alicorp.svg',
    color: '#be2439',
    accent: '#fde8ec',
    featured: true,
  },
  {
    slug: 'backus',
    name: 'Backus',
    aliases: ['Backus', 'Unión de Cervecerías Peruanas Backus y Johnston', 'Backus y Johnston'],
    sector: 'Bebidas',
    description:
      'Empresa del sector bebidas con un portafolio de marcas nacionales e internacionales en Perú.',
    website: 'https://www.backus.pe/',
    logo: '/images/companies/backus-white.png',
    logoBackground: '#101845',
    color: '#152458',
    accent: '#f6edcc',
    featured: true,
  },
  {
    slug: 'gloria',
    name: 'Gloria',
    aliases: ['Gloria', 'Grupo Gloria', 'Gloria SA', 'Gloria S.A.'],
    sector: 'Alimentos y consumo',
    description:
      'Empresa peruana de alimentos y bebidas con un portafolio que incluye productos lácteos.',
    website: 'https://www.gloria.com.pe/',
    logo: '/images/companies/gloria.svg',
    color: '#30205d',
    accent: '#eee7fa',
    featured: true,
  },
  {
    slug: 'pacasmayo',
    name: 'Cementos Pacasmayo',
    aliases: [
      'Pacasmayo',
      'Cementos Pacasmayo',
      'Cementos Pacasmayo SAA',
      'Cementos Pacasmayo S.A.A.',
    ],
    sector: 'Construcción',
    description:
      'Empresa de materiales para la construcción que ofrece cementos, concreto premezclado y otras soluciones constructivas.',
    website: 'https://www.cementospacasmayo.com.pe/',
    logo: '/images/companies/pacasmayo.webp',
    color: '#c62d36',
    accent: '#fcebed',
  },
  {
    slug: 'compartamos',
    name: 'Compartamos Banco',
    aliases: ['Compartamos', 'Compartamos Banco', 'Compartamos Financiera'],
    sector: 'Servicios financieros',
    description:
      'Entidad financiera que ofrece créditos, cuentas de ahorro y otros servicios financieros en Perú.',
    website: 'https://www.compartamos.com.pe/inicio',
    logo: '/images/companies/compartamos.svg',
    color: '#c50066',
    accent: '#fde8f4',
  },
  {
    slug: 'ferreyros',
    name: 'Ferreyros',
    aliases: ['Ferreyros', 'Ferreyros SA', 'Ferreyros S.A.'],
    sector: 'Maquinaria y equipos',
    description:
      'Empresa de maquinaria, equipos, repuestos y servicios para minería, construcción y otros sectores productivos.',
    website: 'https://www.ferreyros.com.pe/',
    logo: '/images/companies/ferreyros.png',
    color: '#5a4921',
    accent: '#fff2c8',
  },
];
export function normalizeCompany(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}
export function belongsToCompany(company: Company, name: string | undefined): boolean {
  return (
    !!name && company.aliases.some((alias) => normalizeCompany(alias) === normalizeCompany(name))
  );
}
