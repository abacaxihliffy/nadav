"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockLayouts = exports.BlockTypes = void 0;
var BlockTypes;
(function (BlockTypes) {
    BlockTypes["lecture"] = "lecture";
    BlockTypes["workshop"] = "workshop";
    BlockTypes["lab"] = "lab";
    BlockTypes["review"] = "review";
    BlockTypes["quiz"] = "quiz";
    BlockTypes["exam"] = "exam";
    /* The tags below refer to the Language Curricula chapter based certifications*/
    BlockTypes["warmup"] = "warm-up";
    BlockTypes["learn"] = "learn";
    BlockTypes["practice"] = "practice";
})(BlockTypes || (exports.BlockTypes = BlockTypes = {}));
var BlockLayouts;
(function (BlockLayouts) {
    /**
     * These three are for the new Full Stack Developer Certification,
     * so we can play with them without affecting the existing block layouts
     */
    BlockLayouts["ChallengeList"] = "challenge-list";
    BlockLayouts["Link"] = "link";
    BlockLayouts["ChallengeGrid"] = "challenge-grid";
    BlockLayouts["DialogueGrid"] = "dialogue-grid";
    /**
     * ChallengeList displays challenges in a list.
     * This layout is used in backend blocks, The Odin Project blocks, and blocks in legacy certification.
     * Example: https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/#basic-javascript
     */
    BlockLayouts["LegacyChallengeList"] = "legacy-challenge-list";
    /**
     * LegacyChallengeGrid displays challenges in a grid.
     * This layout is used for step-based blocks.
     * Example: https://www.freecodecamp.org/learn/2022/responsive-web-design/#learn-html-by-building-a-cat-photo-app
     */
    BlockLayouts["LegacyChallengeGrid"] = "legacy-challenge-grid";
    /**
     * Link displays the block as a single link.
     * This layout is used if the block has a single challenge.
     * Example: https://www.freecodecamp.org/learn/2022/responsive-web-design/#build-a-survey-form-project
     */
    BlockLayouts["LegacyLink"] = "legacy-link";
    /**
     * ProjectList displays a list of certification projects.
     * This layout is used in legacy certifications.
     * Example: https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/#javascript-algorithms-and-data-structures-projects
     */
    BlockLayouts["ProjectList"] = "project-list";
})(BlockLayouts || (exports.BlockLayouts = BlockLayouts = {}));
