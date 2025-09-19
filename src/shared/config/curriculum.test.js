"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = require("./i18n");
const curriculum_1 = require("./curriculum");
describe('superBlockOrder', () => {
    it('should contain all SuperBlocks', () => {
        const allSuperBlocks = Object.values(curriculum_1.SuperBlocks);
        const superBlockOrderValues = Object.values(curriculum_1.superBlockStages).flat();
        expect(superBlockOrderValues).toHaveLength(allSuperBlocks.length);
        expect(superBlockOrderValues).toEqual(expect.arrayContaining(allSuperBlocks));
    });
});
describe('generateSuperBlockList', () => {
    it('should return an array of SuperBlocks object with all elements when if all configs are true', () => {
        const result = (0, curriculum_1.generateSuperBlockList)({
            showUpcomingChanges: true
        });
        expect(result).toHaveLength(Object.values(curriculum_1.superBlockStages).flat().length);
    });
    it('should return an array of SuperBlocks without Upcoming when { showUpcomingChanges: false }', () => {
        const result = (0, curriculum_1.generateSuperBlockList)({
            showUpcomingChanges: false
        });
        const tempSuperBlockMap = { ...curriculum_1.superBlockStages };
        tempSuperBlockMap[curriculum_1.SuperBlockStage.Upcoming] = [];
        tempSuperBlockMap[curriculum_1.SuperBlockStage.Catalog] = [];
        expect(result).toHaveLength(Object.values(tempSuperBlockMap).flat().length);
    });
});
describe('Immutability of superBlockOrder, notAuditedSuperBlocks, and flatSuperBlockMap', () => {
    it('should not allow modification of superBlockOrder', () => {
        expect(() => {
            curriculum_1.superBlockStages[curriculum_1.SuperBlockStage.Core] = [];
        }).toThrow(TypeError);
    });
    it('should not allow modification of notAuditedSuperBlocks', () => {
        expect(() => {
            curriculum_1.notAuditedSuperBlocks[i18n_1.Languages.English] = [];
        }).toThrow(TypeError);
    });
    it('should not allow modification of flatSuperBlockMap', () => {
        expect(() => {
            curriculum_1.notAuditedSuperBlocks[i18n_1.Languages.English] = [];
        }).toThrow(TypeError);
    });
});
describe('getAuditedSuperBlocks', () => {
    Object.keys(curriculum_1.notAuditedSuperBlocks).forEach(language => {
        it(`should return only audited SuperBlocks for ${language}`, () => {
            const auditedSuperBlocks = (0, curriculum_1.getAuditedSuperBlocks)({
                language
            });
            auditedSuperBlocks.forEach(superblock => {
                expect(curriculum_1.notAuditedSuperBlocks[language]).not.toContain(superblock);
            });
        });
    });
});
