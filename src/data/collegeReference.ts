import type { CadetCollegeCode } from '../types';

export type HouseColourKey = 'yellow' | 'red' | 'green' | 'blue' | 'navy_blue';

export const HOUSE_COLOURS: Record<HouseColourKey, { label: string; hex: string }> = {
  yellow: { label: 'Yellow', hex: '#facc15' },
  red: { label: 'Red', hex: '#ef4444' },
  green: { label: 'Green', hex: '#22c55e' },
  blue: { label: 'Blue', hex: '#3b82f6' },
  navy_blue: { label: 'Navy Blue', hex: '#1e3a8a' },
};

export interface HouseReference {
  id: string;
  name: string;
  colour: HouseColourKey;
}

export interface CollegeReference {
  code: CadetCollegeCode;
  name: string;
  abbreviation: string;
  category: 'boys' | 'girls';
  alumniAssociation: { name: string; abbreviation: string };
  houses: readonly HouseReference[];
}

export const COLLEGE_CODES: readonly CadetCollegeCode[] = [
  'FCC', 'JCC', 'MCC', 'RCC', 'SCC', 'CCR', 'BCC', 'PCC', 'CCC', 'MGCC', 'FGCC', 'JGCC',
];

export const COLLEGES: readonly CollegeReference[] = [
  {
    code: 'FCC',
    name: 'Faujdarhat Cadet College',
    abbreviation: 'FCC',
    category: 'boys',
    alumniAssociation: { name: 'Old Faujian Association', abbreviation: 'OFA' },
    houses: [
      { id: 'FCC-RABINDRA', name: 'Rabindra', colour: 'yellow' },
      { id: 'FCC-SHAHIDULLAH', name: 'Shahidullah', colour: 'red' },
      { id: 'FCC-FAZLUL_HOQUE', name: 'Fazlul Hoque', colour: 'green' },
      { id: 'FCC-NAZRUL', name: 'Nazrul', colour: 'blue' },
    ],
  },
  {
    code: 'JCC',
    name: 'Jhenaidah Cadet College',
    abbreviation: 'JCC',
    category: 'boys',
    alumniAssociation: { name: 'Jhenidah Ex-Cadets Association', abbreviation: 'JEXCA' },
    houses: [
      { id: 'JCC-BADR', name: 'Badr', colour: 'green' },
      { id: 'JCC-KHAIBER', name: 'Khaiber', colour: 'blue' },
      { id: 'JCC-HUNAIN', name: 'Hunain', colour: 'red' },
    ],
  },
  {
    code: 'MCC',
    name: 'Mirzapur Cadet College',
    abbreviation: 'MCC',
    category: 'boys',
    alumniAssociation: { name: 'Mirzapur Ex-Cadets Association', abbreviation: 'MECA' },
    houses: [
      { id: 'MCC-FAZLUL_HUQ', name: 'Fazlul Huq', colour: 'blue' },
      { id: 'MCC-SUHRAWARDY', name: 'Suhrawardy', colour: 'red' },
      { id: 'MCC-NAZRUL', name: 'Nazrul', colour: 'green' },
    ],
  },
  {
    code: 'RCC',
    name: 'Rajshahi Cadet College',
    abbreviation: 'RCC',
    category: 'boys',
    alumniAssociation: { name: 'Old Rajshahi Cadets Association', abbreviation: 'ORCA' },
    houses: [
      { id: 'RCC-KHALID', name: 'Khalid', colour: 'green' },
      { id: 'RCC-QASIM', name: 'Qasim', colour: 'navy_blue' },
      { id: 'RCC-TARIQ', name: 'Tariq', colour: 'red' },
    ],
  },
  {
    code: 'SCC',
    name: 'Sylhet Cadet College',
    abbreviation: 'SCC',
    category: 'boys',
    alumniAssociation: { name: 'Old Cadets Association of Sylhet', abbreviation: 'OCAS' },
    houses: [
      { id: 'SCC-HAZRAT_SHAHJALAL', name: 'Hazrat Shahjalal', colour: 'red' },
      { id: 'SCC-TITUMIR', name: 'Titumir', colour: 'blue' },
      { id: 'SCC-SURMA', name: 'Surma', colour: 'green' },
    ],
  },
  {
    code: 'CCR',
    name: 'Rangpur Cadet College',
    abbreviation: 'CCR',
    category: 'boys',
    alumniAssociation: { name: "Rangpur Old Cadets' Association", abbreviation: 'ROCA' },
    houses: [
      { id: 'CCR-OMAR_FARUQUE', name: 'Omar Faruque', colour: 'green' },
      { id: 'CCR-TITUMIR', name: 'Titumir', colour: 'blue' },
      { id: 'CCR-BIRSHRESTHO_JAHANGIR', name: 'Birshrestho Jahangir', colour: 'red' },
    ],
  },
  {
    code: 'BCC',
    name: 'Barishal Cadet College',
    abbreviation: 'BCC',
    category: 'boys',
    alumniAssociation: { name: "Barishal Ex-Cadets' Association", abbreviation: 'BEXCA' },
    houses: [
      { id: 'BCC-SHER_E_BANGLA', name: 'Sher-e-Bangla', colour: 'green' },
      { id: 'BCC-SUHRAWARDY', name: 'Suhrawardy', colour: 'red' },
      { id: 'BCC-SHARIATULLAH', name: 'Shariatullah', colour: 'blue' },
    ],
  },
  {
    code: 'PCC',
    name: 'Pabna Cadet College',
    abbreviation: 'PCC',
    category: 'boys',
    alumniAssociation: { name: 'Association of Pabna Ex-Cadets', abbreviation: 'APEC' },
    houses: [
      { id: 'PCC-BHASHANI', name: 'Bhashani', colour: 'blue' },
      { id: 'PCC-TITUMIR', name: 'Titumir', colour: 'green' },
      { id: 'PCC-SHIRAJI', name: 'Shiraji', colour: 'red' },
    ],
  },
  {
    code: 'CCC',
    name: 'Cumilla Cadet College',
    abbreviation: 'CCC',
    category: 'boys',
    alumniAssociation: { name: 'Association Of Cumilla Old Cadets', abbreviation: 'ACOC' },
    houses: [
      { id: 'CCC-MEGHNA', name: 'Meghna', colour: 'blue' },
      { id: 'CCC-GOMATI', name: 'Gomati', colour: 'red' },
      { id: 'CCC-TITAS', name: 'Titas', colour: 'green' },
    ],
  },
  {
    code: 'MGCC',
    name: "Mymensingh Girls' Cadet College",
    abbreviation: 'MGCC',
    category: 'girls',
    alumniAssociation: { name: 'Association of Mymensingh Ex-Cadets', abbreviation: 'AMEC' },
    houses: [
      { id: 'MGCC-SATYA', name: 'Satya', colour: 'green' },
      { id: 'MGCC-SHANTI', name: 'Shanti', colour: 'red' },
      { id: 'MGCC-SADACHAR', name: 'Sadachar', colour: 'blue' },
    ],
  },
  {
    code: 'FGCC',
    name: "Feni Girls' Cadet College",
    abbreviation: 'FGCC',
    category: 'girls',
    alumniAssociation: { name: 'Ex Cadet Association of Feni Girls Cadet College', abbreviation: 'EXCAF' },
    houses: [
      { id: 'FGCC-KHADIZA', name: 'Khadiza', colour: 'green' },
      { id: 'FGCC-AYESHA', name: 'Ayesha', colour: 'blue' },
      { id: 'FGCC-FATEMA', name: 'Fatema', colour: 'red' },
    ],
  },
  {
    code: 'JGCC',
    name: "Joypurhat Girls' Cadet College",
    abbreviation: 'JGCC',
    category: 'girls',
    alumniAssociation: { name: 'Association of Joypurhat Ex-Cadets', abbreviation: 'AJEC' },
    houses: [
      { id: 'JGCC-SULTANA_RAZIA', name: 'Sultana Razia', colour: 'green' },
      { id: 'JGCC-TARAMON_BIBI', name: 'Taramon Bibi', colour: 'red' },
      { id: 'JGCC-BIRPROTIC_CAPTAIN_SETARA_BEGUM', name: 'Birprotic Captain Setara Begum', colour: 'blue' },
    ],
  },
];

export function getCollege(code: CadetCollegeCode): CollegeReference | undefined {
  return COLLEGES.find((college) => college.code === code);
}

export function findHouse(
  houseId: string,
): { college: CollegeReference; house: HouseReference } | undefined {
  for (const college of COLLEGES) {
    const house = college.houses.find((h) => h.id === houseId);
    if (house) return { college, house };
  }
  return undefined;
}

export function isHouseOfCollege(houseId: string, code: CadetCollegeCode): boolean {
  return getCollege(code)?.houses.some((h) => h.id === houseId) ?? false;
}

export function formatHouseLabel(houseId: string): string {
  const match = findHouse(houseId);
  return match ? `${match.house.name} House` : '';
}

export function validateCollegeReference(colleges: readonly CollegeReference[] = COLLEGES): string[] {
  const errors: string[] = [];

  for (const code of COLLEGE_CODES) {
    const count = colleges.filter((c) => c.code === code).length;
    if (count !== 1) errors.push(`College ${code} must appear exactly once (found ${count}).`);
  }

  for (const college of colleges) {
    if (!COLLEGE_CODES.includes(college.code)) {
      errors.push(`Unknown college code ${college.code}.`);
    }
    if (college.houses.length === 0) {
      errors.push(`College ${college.code} has no houses.`);
    }
    for (const house of college.houses) {
      if (!house.id.startsWith(`${college.code}-`)) {
        errors.push(`House ${house.id} does not belong to college ${college.code}.`);
      }
      if (!(house.colour in HOUSE_COLOURS)) {
        errors.push(`House ${house.id} has an unknown colour.`);
      }
    }
  }

  const allHouseIds = colleges.flatMap((c) => c.houses.map((h) => h.id));
  const duplicateIds = allHouseIds.filter((id, i) => allHouseIds.indexOf(id) !== i);
  for (const id of new Set(duplicateIds)) {
    errors.push(`House ID ${id} is used more than once.`);
  }

  return errors;
}
