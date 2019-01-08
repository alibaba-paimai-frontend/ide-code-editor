import Chance from 'chance';
const chance = new Chance();

export function editorConfigGen() {
  return {
    width: chance.integer({ min: 200, max: 500 }),
    height: chance.integer({ min: 300, max: 500 }),
    language: chance.pick(['json', 'typescript', 'javascript']),
    wait: chance.floating({ min: 0.5, max: 2 }),
    options: { readOnly: false },
    value: chance.sentence(chance.integer({min: 10, max: 30}))
  };
}
