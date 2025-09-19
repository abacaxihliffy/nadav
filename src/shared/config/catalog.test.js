"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const curriculum_1 = require("./curriculum");
const catalog_1 = require("./catalog");
describe('catalog', () => {
    it('should have exactly one entry for each superblock in SuperBlockStage.Catalog', () => {
        expect(catalog_1.catalog.map(course => course.superBlock.toString()).sort()).toEqual(curriculum_1.catalogSuperBlocks.map(sb => sb.toString()).sort());
    });
});
