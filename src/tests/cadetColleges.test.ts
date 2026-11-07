import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { 
  CADET_COLLEGES_DATA, 
  getAllColleges, 
  getAllHouses, 
  getAllAlumniAssociations, 
  getCollegeById, 
  getHousesByCollegeId, 
  getHouseById,
  getCollegesByCategory,
  COLLEGES_BY_ID,
  HOUSES_BY_ID,
  HouseColour
} from '../data/cadetColleges';

// Authoritative ground-truth reference dataset for verification
const AUTHORITATIVE_SPEC = [
  {
    code: 'FCC',
    name: 'Faujdarhat Cadet College',
    alumni: { name: 'Old Faujian Association', abbreviation: 'OFA' },
    category: 'boys',
    houses: [
      { name: 'Rabindra House', colour: 'Yellow' as HouseColour },
      { name: 'Shahidullah House', colour: 'Red' as HouseColour },
      { name: 'Fazlul Hoque House', colour: 'Green' as HouseColour },
      { name: 'Nazrul House', colour: 'Blue' as HouseColour },
    ],
  },
  {
    code: 'JCC',
    name: 'Jhenaidah Cadet College',
    alumni: { name: 'Jhenidah Ex-Cadets Association', abbreviation: 'JEXCA' },
    category: 'boys',
    houses: [
      { name: 'Badr House', colour: 'Green' as HouseColour },
      { name: 'Khaiber House', colour: 'Blue' as HouseColour },
      { name: 'Hunain House', colour: 'Red' as HouseColour },
    ],
  },
  {
    code: 'MCC',
    name: 'Mirzapur Cadet College',
    alumni: { name: 'Mirzapur Ex-Cadets Association', abbreviation: 'MECA' },
    category: 'boys',
    houses: [
      { name: 'Fazlul Huq House', colour: 'Blue' as HouseColour },
      { name: 'Suhrawardy House', colour: 'Red' as HouseColour },
      { name: 'Nazrul House', colour: 'Green' as HouseColour },
    ],
  },
  {
    code: 'RCC',
    name: 'Rajshahi Cadet College',
    alumni: { name: 'Old Rajshahi Cadets Association', abbreviation: 'ORCA' },
    category: 'boys',
    houses: [
      { name: 'Khalid House', colour: 'Green' as HouseColour },
      { name: 'Qasim House', colour: 'Navy Blue' as HouseColour },
      { name: 'Tariq House', colour: 'Red' as HouseColour },
    ],
  },
  {
    code: 'SCC',
    name: 'Sylhet Cadet College',
    alumni: { name: 'Old Cadets Association of Sylhet', abbreviation: 'OCAS' },
    category: 'boys',
    houses: [
      { name: 'Hazrat Shahjalal House', colour: 'Red' as HouseColour },
      { name: 'Titumir House', colour: 'Blue' as HouseColour },
      { name: 'Surma House', colour: 'Green' as HouseColour },
    ],
  },
  {
    code: 'CCR',
    name: 'Rangpur Cadet College',
    alumni: { name: "Rangpur Old Cadets' Association", abbreviation: 'ROCA' },
    category: 'boys',
    houses: [
      { name: 'Omar Faruque House', colour: 'Green' as HouseColour },
      { name: 'Titumir House', colour: 'Blue' as HouseColour },
      { name: 'Birshrestho Jahangir House', colour: 'Red' as HouseColour },
    ],
  },
  {
    code: 'BCC',
    name: 'Barisal Cadet College',
    alumni: { name: "Barishal Ex-Cadets' Association", abbreviation: 'BEXCA' },
    category: 'boys',
    houses: [
      { name: 'Sher-e-Bangla House', colour: 'Green' as HouseColour },
      { name: 'Suhrawardy House', colour: 'Red' as HouseColour },
      { name: 'Shariatullah House', colour: 'Blue' as HouseColour },
    ],
  },
  {
    code: 'PCC',
    name: 'Pabna Cadet College',
    alumni: { name: 'Association of Pabna Ex-Cadets', abbreviation: 'APEC' },
    category: 'boys',
    houses: [
      { name: 'Bhashani House', colour: 'Blue' as HouseColour },
      { name: 'Titumir House', colour: 'Green' as HouseColour },
      { name: 'Shiraji House', colour: 'Red' as HouseColour },
    ],
  },
  {
    code: 'CCC',
    name: 'Comilla Cadet College',
    alumni: { name: 'Association Of Cumilla Old Cadets', abbreviation: 'ACOC' },
    category: 'boys',
    houses: [
      { name: 'Meghna House', colour: 'Blue' as HouseColour },
      { name: 'Gomati House', colour: 'Red' as HouseColour },
      { name: 'Titas House', colour: 'Green' as HouseColour },
    ],
  },
  {
    code: 'MGCC',
    name: "Mymensingh Girls' Cadet College",
    alumni: { name: 'Association Of Mymensingh Ex-Cadets', abbreviation: 'AMEC' },
    category: 'girls',
    houses: [
      { name: 'Satya House', colour: 'Green' as HouseColour },
      { name: 'Shanti House', colour: 'Red' as HouseColour },
      { name: 'Sadachar House', colour: 'Blue' as HouseColour },
    ],
  },
  {
    code: 'FGCC',
    name: "Feni Girls' Cadet College",
    alumni: { name: 'Ex Cadet Association of Feni Girls Cadet College', abbreviation: 'EXCAF' },
    category: 'girls',
    houses: [
      { name: 'Khadiza House', colour: 'Green' as HouseColour },
      { name: 'Ayesha House', colour: 'Blue' as HouseColour },
      { name: 'Fatema House', colour: 'Red' as HouseColour },
    ],
  },
  {
    code: 'JGCC',
    name: "Joypurhat Girls' Cadet College",
    alumni: { name: 'Association of Joypurhat Ex-Cadets', abbreviation: 'AJEC' },
    category: 'girls',
    houses: [
      { name: 'Sultana Razia House', colour: 'Green' as HouseColour },
      { name: 'Taramon Bibi House', colour: 'Red' as HouseColour },
      { name: 'Birprotic Captain Setara Begum House', colour: 'Blue' as HouseColour },
    ],
  },
];

describe('CadetVerse Step 1 Validation: Authoritative Dataset Integrity', () => {

  test('1. Exact Counts: exactly 12 colleges, 37 houses, and 12 alumni associations', () => {
    const colleges = getAllColleges();
    assert.equal(colleges.length, 12, 'Must contain exactly 12 cadet colleges');

    const houses = getAllHouses();
    assert.equal(houses.length, 37, 'Must contain exactly 37 houses (4 for FCC, 3 for other 11 colleges)');

    const alumniAssociations = getAllAlumniAssociations();
    assert.equal(alumniAssociations.length, 12, 'Must contain exactly 12 alumni associations');
  });

  test('2. Uniqueness: all college IDs and house IDs must be globally unique', () => {
    const colleges = getAllColleges();
    const collegeIds = colleges.map((c) => c.id);
    const uniqueCollegeIds = new Set(collegeIds);
    assert.equal(uniqueCollegeIds.size, 12, 'All 12 college IDs must be unique');

    const collegeAbbrs = colleges.map((c) => c.abbreviation);
    const uniqueCollegeAbbrs = new Set(collegeAbbrs);
    assert.equal(uniqueCollegeAbbrs.size, 12, 'All 12 college abbreviations must be unique');

    const houses = getAllHouses();
    const houseIds = houses.map((h) => h.id);
    const uniqueHouseIds = new Set(houseIds);
    assert.equal(uniqueHouseIds.size, 37, 'All 37 house IDs must be unique');
  });

  test("3. Integrity: every house's collegeId matches its parent college", () => {
    const colleges = getAllColleges();
    colleges.forEach((college) => {
      college.houses.forEach((house) => {
        assert.equal(
          house.collegeId,
          college.id,
          `House ${house.name} (${house.id}) collegeId must equal parent college id ${college.id}`
        );
      });
    });
  });

  test('4. Authoritative Verification: exact college names, alumni associations, house names, and colours', () => {
    AUTHORITATIVE_SPEC.forEach((spec) => {
      const college = getCollegeById(spec.code);
      assert.ok(college, `College with abbreviation ${spec.code} must exist`);
      assert.equal(college.name, spec.name, `College name for ${spec.code} must match authoritative name`);
      assert.equal(college.category, spec.category, `College category for ${spec.code} must match`);
      
      // Alumni association verification
      assert.equal(
        college.alumniAssociation.name,
        spec.alumni.name,
        `Alumni association name for ${spec.code} must match authoritative title`
      );
      assert.equal(
        college.alumniAssociation.abbreviation,
        spec.alumni.abbreviation,
        `Alumni association abbreviation for ${spec.code} must match authoritative abbreviation`
      );

      // Houses verification
      assert.equal(
        college.houses.length,
        spec.houses.length,
        `House count for ${spec.code} must match expected ${spec.houses.length}`
      );

      spec.houses.forEach((specHouse, idx) => {
        const actualHouse = college.houses[idx];
        assert.ok(actualHouse, `House at index ${idx} for ${spec.code} must exist`);
        assert.equal(actualHouse.name, specHouse.name, `House name must match authoritative name`);
        assert.equal(actualHouse.colour, specHouse.colour, `House colour must match authoritative colour`);
      });
    });
  });

  test('5. Distinct Navy Blue Support: Navy Blue is distinct from standard Blue', () => {
    const rcc = getCollegeById('RCC');
    assert.ok(rcc);
    const qasimHouse = rcc.houses.find((h) => h.name === 'Qasim House');
    assert.ok(qasimHouse);
    assert.equal(qasimHouse.colour, 'Navy Blue');
    assert.equal(qasimHouse.hexColor, '#1e3a8a');

    // Verify other standard Blue houses have distinct standard Blue hex (#3b82f6)
    const fccNazrul = getHouseById('fcc-nazrul');
    assert.ok(fccNazrul);
    assert.equal(fccNazrul.colour, 'Blue');
    assert.equal(fccNazrul.hexColor, '#3b82f6');
    assert.notEqual(qasimHouse.hexColor, fccNazrul.hexColor);
  });

  test('6. Query Helpers: getHousesByCollegeId and getHouseById return correct records', () => {
    const fccHouses = getHousesByCollegeId('fcc');
    assert.equal(fccHouses.length, 4);

    const mccHouses = getHousesByCollegeId('MCC');
    assert.equal(mccHouses.length, 3);

    const house = getHouseById('jcc-badr');
    assert.ok(house);
    assert.equal(house.name, 'Badr House');
    assert.equal(house.colour, 'Green');
    assert.equal(house.collegeId, 'jcc');

    const boysColleges = getCollegesByCategory('boys');
    assert.equal(boysColleges.length, 9);

    const girlsColleges = getCollegesByCategory('girls');
    assert.equal(girlsColleges.length, 3);
  });
});
