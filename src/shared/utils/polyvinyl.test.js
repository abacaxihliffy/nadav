"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const polyvinyl_1 = require("./polyvinyl");
const polyData = {
    name: 'test',
    ext: 'js',
    contents: 'var hello = world;',
    history: ['test.js']
};
describe('createSource', () => {
    it('should return a vinyl object with a source matching the contents', () => {
        const original = (0, polyvinyl_1.createPoly)(polyData);
        const updated = (0, polyvinyl_1.createSource)(original);
        expect(original).not.toHaveProperty('source');
        expect(updated).toHaveProperty('source', 'var hello = world;');
        expect(updated).toMatchObject(original);
    });
    it('should not update the source if it already exists', () => {
        const original = (0, polyvinyl_1.createPoly)({
            ...polyData,
            source: 'const hello = world;'
        });
        const updated = (0, polyvinyl_1.createSource)(original);
        expect(updated).toStrictEqual(original);
    });
});
