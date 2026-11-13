/**
 * CadetVerse Centralized Reference Data
 * 
 * Authoritative typed reference data for all 12 Bangladesh Cadet Colleges,
 * their respective houses, house colours, and alumni associations.
 */

export type CollegeCategory = 'boys' | 'girls';

export type HouseColour = 'Yellow' | 'Red' | 'Green' | 'Blue' | 'Navy Blue';

export type CadetCollegeCode = 
  | 'FCC'  // Faujdarhat Cadet College
  | 'JCC'  // Jhenaidah Cadet College
  | 'MCC'  // Mirzapur Cadet College
  | 'RCC'  // Rajshahi Cadet College
  | 'SCC'  // Sylhet Cadet College
  | 'CCR'  // Rangpur Cadet College
  | 'BCC'  // Barishal Cadet College
  | 'PCC'  // Pabna Cadet College
  | 'CCC'  // Comilla Cadet College
  | 'MGCC' // Mymensingh Girls' Cadet College
  | 'FGCC' // Feni Girls' Cadet College
  | 'JGCC';// Joypurhat Girls' Cadet College

export interface House {
  /** Stable unique identifier for the house */
  id: string;
  /** Official house name */
  name: string;
  /** Authoritative house colour */
  colour: HouseColour;
  /** Hex colour representation for UI badges and accents */
  hexColor: string;
  /** Unique college ID this house strictly belongs to */
  collegeId: string;
}

export interface AlumniAssociation {
  /** Official name of the alumni association */
  name: string;
  /** Standard abbreviation */
  abbreviation: string;
}

export interface CadetCollege {
  /** Stable unique college ID (lowercase abbreviation) */
  id: string;
  /** Official full college name */
  name: string;
  /** Standard uppercase college abbreviation */
  abbreviation: CadetCollegeCode;
  /** Institutional category: boys or girls */
  category: CollegeCategory;
  /** Authoritative alumni association */
  alumniAssociation: AlumniAssociation;
  /** Houses belonging to this college */
  houses: House[];
  /** Historical year of establishment */
  established: number;
  /** Campus geographic location */
  location: string;
  /** College motto */
  motto: string;
}

/**
 * Standard hex color map for authoritative house colours.
 * Note: 'Navy Blue' is distinct from 'Blue'.
 */
export const HOUSE_COLOUR_HEX: Record<HouseColour, string> = {
  'Yellow': '#eab308',
  'Red': '#ef4444',
  'Green': '#10b981',
  'Blue': '#3b82f6',
  'Navy Blue': '#1e3a8a',
};

/**
 * Authoritative dataset for all 12 Bangladesh Cadet Colleges.
 */
export const CADET_COLLEGES_DATA: readonly CadetCollege[] = [
  {
    id: 'fcc',
    name: 'Faujdarhat Cadet College',
    abbreviation: 'FCC',
    category: 'boys',
    established: 1958,
    location: 'Chittagong',
    motto: 'Deeds Not Words',
    alumniAssociation: {
      name: 'Old Faujian Association',
      abbreviation: 'OFA',
    },
    houses: [
      {
        id: 'fcc-rabindra',
        name: 'Rabindra House',
        colour: 'Yellow',
        hexColor: HOUSE_COLOUR_HEX['Yellow'],
        collegeId: 'fcc',
      },
      {
        id: 'fcc-shahidullah',
        name: 'Shahidullah House',
        colour: 'Red',
        hexColor: HOUSE_COLOUR_HEX['Red'],
        collegeId: 'fcc',
      },
      {
        id: 'fcc-fazlul-hoque',
        name: 'Fazlul Hoque House',
        colour: 'Green',
        hexColor: HOUSE_COLOUR_HEX['Green'],
        collegeId: 'fcc',
      },
      {
        id: 'fcc-nazrul',
        name: 'Nazrul House',
        colour: 'Blue',
        hexColor: HOUSE_COLOUR_HEX['Blue'],
        collegeId: 'fcc',
      },
    ],
  },
  {
    id: 'jcc',
    name: 'Jhenaidah Cadet College',
    abbreviation: 'JCC',
    category: 'boys',
    established: 1963,
    location: 'Jhenaidah',
    motto: 'Character is Destiny',
    alumniAssociation: {
      name: 'Jhenidah Ex-Cadets Association',
      abbreviation: 'JEXCA',
    },
    houses: [
      {
        id: 'jcc-badr',
        name: 'Badr House',
        colour: 'Green',
        hexColor: HOUSE_COLOUR_HEX['Green'],
        collegeId: 'jcc',
      },
      {
        id: 'jcc-khaiber',
        name: 'Khaiber House',
        colour: 'Blue',
        hexColor: HOUSE_COLOUR_HEX['Blue'],
        collegeId: 'jcc',
      },
      {
        id: 'jcc-hunain',
        name: 'Hunain House',
        colour: 'Red',
        hexColor: HOUSE_COLOUR_HEX['Red'],
        collegeId: 'jcc',
      },
    ],
  },
  {
    id: 'mcc',
    name: 'Mirzapur Cadet College',
    abbreviation: 'MCC',
    category: 'boys',
    established: 1963,
    location: 'Tangail',
    motto: 'Enter to Learn, Go Forth to Serve',
    alumniAssociation: {
      name: 'Mirzapur Ex-Cadets Association',
      abbreviation: 'MECA',
    },
    houses: [
      {
        id: 'mcc-fazlul-huq',
        name: 'Fazlul Huq House',
        colour: 'Blue',
        hexColor: HOUSE_COLOUR_HEX['Blue'],
        collegeId: 'mcc',
      },
      {
        id: 'mcc-suhrawardy',
        name: 'Suhrawardy House',
        colour: 'Red',
        hexColor: HOUSE_COLOUR_HEX['Red'],
        collegeId: 'mcc',
      },
      {
        id: 'mcc-nazrul',
        name: 'Nazrul House',
        colour: 'Green',
        hexColor: HOUSE_COLOUR_HEX['Green'],
        collegeId: 'mcc',
      },
    ],
  },
  {
    id: 'rcc',
    name: 'Rajshahi Cadet College',
    abbreviation: 'RCC',
    category: 'boys',
    established: 1966,
    location: 'Sarda, Rajshahi',
    motto: 'Knowledge is Light',
    alumniAssociation: {
      name: 'Old Rajshahi Cadets Association',
      abbreviation: 'ORCA',
    },
    houses: [
      {
        id: 'rcc-khalid',
        name: 'Khalid House',
        colour: 'Green',
        hexColor: HOUSE_COLOUR_HEX['Green'],
        collegeId: 'rcc',
      },
      {
        id: 'rcc-qasim',
        name: 'Qasim House',
        colour: 'Navy Blue',
        hexColor: HOUSE_COLOUR_HEX['Navy Blue'],
        collegeId: 'rcc',
      },
      {
        id: 'rcc-tariq',
        name: 'Tariq House',
        colour: 'Red',
        hexColor: HOUSE_COLOUR_HEX['Red'],
        collegeId: 'rcc',
      },
    ],
  },
  {
    id: 'scc',
    name: 'Sylhet Cadet College',
    abbreviation: 'SCC',
    category: 'boys',
    established: 1978,
    location: 'Sylhet',
    motto: 'Truth is Beauty',
    alumniAssociation: {
      name: 'Old Cadets Association of Sylhet',
      abbreviation: 'OCAS',
    },
    houses: [
      {
        id: 'scc-hazrat-shahjalal',
        name: 'Hazrat Shahjalal House',
        colour: 'Red',
        hexColor: HOUSE_COLOUR_HEX['Red'],
        collegeId: 'scc',
      },
      {
        id: 'scc-titumir',
        name: 'Titumir House',
        colour: 'Blue',
        hexColor: HOUSE_COLOUR_HEX['Blue'],
        collegeId: 'scc',
      },
      {
        id: 'scc-surma',
        name: 'Surma House',
        colour: 'Green',
        hexColor: HOUSE_COLOUR_HEX['Green'],
        collegeId: 'scc',
      },
    ],
  },
  {
    id: 'ccr',
    name: 'Rangpur Cadet College',
    abbreviation: 'CCR',
    category: 'boys',
    established: 1979,
    location: 'Rangpur',
    motto: 'Aim High',
    alumniAssociation: {
      name: 'Rangpur Old Cadets\' Association',
      abbreviation: 'ROCA',
    },
    houses: [
      {
        id: 'ccr-omar-faruque',
        name: 'Omar Faruque House',
        colour: 'Green',
        hexColor: HOUSE_COLOUR_HEX['Green'],
        collegeId: 'ccr',
      },
      {
        id: 'ccr-titumir',
        name: 'Titumir House',
        colour: 'Blue',
        hexColor: HOUSE_COLOUR_HEX['Blue'],
        collegeId: 'ccr',
      },
      {
        id: 'ccr-birshrestho-jahangir',
        name: 'Birshrestho Jahangir House',
        colour: 'Red',
        hexColor: HOUSE_COLOUR_HEX['Red'],
        collegeId: 'ccr',
      },
    ],
  },
  {
    id: 'bcc',
    name: 'Barisal Cadet College',
    abbreviation: 'BCC',
    category: 'boys',
    established: 1981,
    location: 'Barishal',
    motto: 'Strive for Excellence',
    alumniAssociation: {
      name: 'Barishal Ex-Cadets\' Association',
      abbreviation: 'BEXCA',
    },
    houses: [
      {
        id: 'bcc-sher-e-bangla',
        name: 'Sher-e-Bangla House',
        colour: 'Green',
        hexColor: HOUSE_COLOUR_HEX['Green'],
        collegeId: 'bcc',
      },
      {
        id: 'bcc-suhrawardy',
        name: 'Suhrawardy House',
        colour: 'Red',
        hexColor: HOUSE_COLOUR_HEX['Red'],
        collegeId: 'bcc',
      },
      {
        id: 'bcc-shariatullah',
        name: 'Shariatullah House',
        colour: 'Blue',
        hexColor: HOUSE_COLOUR_HEX['Blue'],
        collegeId: 'bcc',
      },
    ],
  },
  {
    id: 'pcc',
    name: 'Pabna Cadet College',
    abbreviation: 'PCC',
    category: 'boys',
    established: 1981,
    location: 'Pabna',
    motto: 'Service Before Self',
    alumniAssociation: {
      name: 'Association of Pabna Ex-Cadets',
      abbreviation: 'APEC',
    },
    houses: [
      {
        id: 'pcc-bhashani',
        name: 'Bhashani House',
        colour: 'Blue',
        hexColor: HOUSE_COLOUR_HEX['Blue'],
        collegeId: 'pcc',
      },
      {
        id: 'pcc-titumir',
        name: 'Titumir House',
        colour: 'Green',
        hexColor: HOUSE_COLOUR_HEX['Green'],
        collegeId: 'pcc',
      },
      {
        id: 'pcc-shiraji',
        name: 'Shiraji House',
        colour: 'Red',
        hexColor: HOUSE_COLOUR_HEX['Red'],
        collegeId: 'pcc',
      },
    ],
  },
  {
    id: 'ccc',
    name: 'Comilla Cadet College',
    abbreviation: 'CCC',
    category: 'boys',
    established: 1983,
    location: 'Kotbari, Cumilla',
    motto: 'Character, Discipline, Devotion',
    alumniAssociation: {
      name: 'Association Of Cumilla Old Cadets',
      abbreviation: 'ACOC',
    },
    houses: [
      {
        id: 'ccc-meghna',
        name: 'Meghna House',
        colour: 'Blue',
        hexColor: HOUSE_COLOUR_HEX['Blue'],
        collegeId: 'ccc',
      },
      {
        id: 'ccc-gomati',
        name: 'Gomati House',
        colour: 'Red',
        hexColor: HOUSE_COLOUR_HEX['Red'],
        collegeId: 'ccc',
      },
      {
        id: 'ccc-titas',
        name: 'Titas House',
        colour: 'Green',
        hexColor: HOUSE_COLOUR_HEX['Green'],
        collegeId: 'ccc',
      },
    ],
  },
  {
    id: 'mgcc',
    name: 'Mymensingh Girls\' Cadet College',
    abbreviation: 'MGCC',
    category: 'girls',
    established: 1982,
    location: 'Mymensingh',
    motto: 'Wisdom, Courage, Discipline',
    alumniAssociation: {
      name: 'Association Of Mymensingh Ex-Cadets',
      abbreviation: 'AMEC',
    },
    houses: [
      {
        id: 'mgcc-satya',
        name: 'Satya House',
        colour: 'Green',
        hexColor: HOUSE_COLOUR_HEX['Green'],
        collegeId: 'mgcc',
      },
      {
        id: 'mgcc-shanti',
        name: 'Shanti House',
        colour: 'Red',
        hexColor: HOUSE_COLOUR_HEX['Red'],
        collegeId: 'mgcc',
      },
      {
        id: 'mgcc-sadachar',
        name: 'Sadachar House',
        colour: 'Blue',
        hexColor: HOUSE_COLOUR_HEX['Blue'],
        collegeId: 'mgcc',
      },
    ],
  },
  {
    id: 'fgcc',
    name: 'Feni Girls\' Cadet College',
    abbreviation: 'FGCC',
    category: 'girls',
    established: 2006,
    location: 'Feni',
    motto: 'Courage, Honor, Integrity',
    alumniAssociation: {
      name: 'Ex Cadet Association of Feni Girls Cadet College',
      abbreviation: 'EXCAF',
    },
    houses: [
      {
        id: 'fgcc-khadiza',
        name: 'Khadiza House',
        colour: 'Green',
        hexColor: HOUSE_COLOUR_HEX['Green'],
        collegeId: 'fgcc',
      },
      {
        id: 'fgcc-ayesha',
        name: 'Ayesha House',
        colour: 'Blue',
        hexColor: HOUSE_COLOUR_HEX['Blue'],
        collegeId: 'fgcc',
      },
      {
        id: 'fgcc-fatema',
        name: 'Fatema House',
        colour: 'Red',
        hexColor: HOUSE_COLOUR_HEX['Red'],
        collegeId: 'fgcc',
      },
    ],
  },
  {
    id: 'jgcc',
    name: 'Joypurhat Girls\' Cadet College',
    abbreviation: 'JGCC',
    category: 'girls',
    established: 2006,
    location: 'Joypurhat',
    motto: 'Enlightened Women, Empowered Nation',
    alumniAssociation: {
      name: 'Association of Joypurhat Ex-Cadets',
      abbreviation: 'AJEC',
    },
    houses: [
      {
        id: 'jgcc-sultana-razia',
        name: 'Sultana Razia House',
        colour: 'Green',
        hexColor: HOUSE_COLOUR_HEX['Green'],
        collegeId: 'jgcc',
      },
      {
        id: 'jgcc-taramon-bibi',
        name: 'Taramon Bibi House',
        colour: 'Red',
        hexColor: HOUSE_COLOUR_HEX['Red'],
        collegeId: 'jgcc',
      },
      {
        id: 'jgcc-setara-begum',
        name: 'Birprotic Captain Setara Begum House',
        colour: 'Blue',
        hexColor: HOUSE_COLOUR_HEX['Blue'],
        collegeId: 'jgcc',
      },
    ],
  },
] as const;

/**
 * Fast lookup map for Cadet Colleges by unique ID (e.g. 'fcc') or Abbreviation (e.g. 'FCC').
 */
export const COLLEGES_BY_ID: Record<string, CadetCollege> = CADET_COLLEGES_DATA.reduce(
  (acc, college) => {
    acc[college.id] = college;
    acc[college.abbreviation] = college;
    acc[college.abbreviation.toLowerCase()] = college;
    return acc;
  },
  {} as Record<string, CadetCollege>
);

/**
 * Fast lookup map for all houses across all cadet colleges by House ID.
 */
export const HOUSES_BY_ID: Record<string, House> = CADET_COLLEGES_DATA.reduce(
  (acc, college) => {
    college.houses.forEach((house) => {
      acc[house.id] = house;
    });
    return acc;
  },
  {} as Record<string, House>
);

/**
 * Flatted array of all houses across all 12 colleges.
 */
export const ALL_HOUSES: readonly House[] = CADET_COLLEGES_DATA.flatMap(
  (college) => college.houses
);

/**
 * Retrieve a college by its unique ID (e.g. 'fcc') or abbreviation (e.g. 'FCC').
 */
export function getCollegeById(idOrCode: string): CadetCollege | undefined {
  if (!idOrCode) return undefined;
  return COLLEGES_BY_ID[idOrCode] || COLLEGES_BY_ID[idOrCode.toLowerCase()] || COLLEGES_BY_ID[idOrCode.toUpperCase()];
}

/**
 * Retrieve all houses belonging to a specific college.
 */
export function getHousesByCollegeId(collegeIdOrCode: string): House[] {
  const college = getCollegeById(collegeIdOrCode);
  return college ? [...college.houses] : [];
}

/**
 * Retrieve a house by its unique House ID (e.g. 'fcc-rabindra', 'rcc-qasim').
 */
export function getHouseById(houseId: string): House | undefined {
  if (!houseId) return undefined;
  return HOUSES_BY_ID[houseId];
}

/**
 * Get all 12 cadet colleges.
 */
export function getAllColleges(): readonly CadetCollege[] {
  return CADET_COLLEGES_DATA;
}

/**
 * Get all houses across all colleges.
 */
export function getAllHouses(): readonly House[] {
  return ALL_HOUSES;
}

/**
 * Get all 12 alumni associations.
 */
export function getAllAlumniAssociations(): AlumniAssociation[] {
  return CADET_COLLEGES_DATA.map((c) => c.alumniAssociation);
}

/**
 * Filter colleges by category ('boys' | 'girls').
 */
export function getCollegesByCategory(category: CollegeCategory): CadetCollege[] {
  return CADET_COLLEGES_DATA.filter((c) => c.category === category);
}
