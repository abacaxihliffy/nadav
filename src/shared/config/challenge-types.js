"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDailyCodingChallengeLanguage = exports.dailyCodingChallengeLanguages = exports.getIsDailyCodingChallenge = exports.dailyCodingChallengeTypes = exports.canSaveToDB = exports.submitTypes = exports.viewTypes = exports.hasNoSolution = exports.challengeTypes = void 0;
const html = 0;
const js = 1;
const backend = 2;
const zipline = 3;
const frontEndProject = 3;
const backEndProject = 4;
const jsProject = 5;
const modern = 6;
const step = 7;
const quiz = 8;
const invalid = 9;
const pythonProject = 10;
const video = 11;
const codeAllyPractice = 12;
const codeAllyCert = 13;
const multifileCertProject = 14;
const theOdinProject = 15;
const colab = 16;
const exam = 17;
const msTrophy = 18;
const multipleChoice = 19;
const python = 20;
const dialogue = 21;
const fillInTheBlank = 22;
const multifilePythonCertProject = 23;
const generic = 24;
const lab = 25;
const jsLab = 26;
const pyLab = 27;
const dailyChallengeJs = 28;
const dailyChallengePy = 29;
const examDownload = 30;
const review = 31;
exports.challengeTypes = {
    html,
    js,
    backend,
    zipline,
    frontEndProject,
    backEndProject,
    pythonProject,
    jsProject,
    modern,
    step,
    quiz,
    invalid,
    video,
    codeAllyPractice,
    codeAllyCert,
    multifileCertProject,
    theOdinProject,
    colab,
    exam,
    msTrophy,
    multipleChoice,
    python,
    dialogue,
    fillInTheBlank,
    multifilePythonCertProject,
    generic,
    lab,
    jsLab,
    pyLab,
    dailyChallengeJs,
    dailyChallengePy,
    examDownload,
    review
};
const hasNoSolution = (challengeType) => {
    const noSolutions = [
        backend,
        zipline,
        frontEndProject,
        backEndProject,
        step,
        quiz,
        invalid,
        pythonProject,
        video,
        codeAllyPractice,
        codeAllyCert,
        theOdinProject,
        colab,
        exam,
        msTrophy,
        multipleChoice,
        dialogue,
        fillInTheBlank,
        generic,
        examDownload,
        review
    ];
    return noSolutions.includes(challengeType);
};
exports.hasNoSolution = hasNoSolution;
// determine the component view for each challenge
exports.viewTypes = {
    [html]: 'classic',
    [js]: 'classic',
    [jsProject]: 'classic',
    [frontEndProject]: 'frontend',
    [backEndProject]: 'backend',
    [pythonProject]: 'frontend',
    [modern]: 'modern',
    [step]: 'step',
    [quiz]: 'quiz',
    [backend]: 'backend',
    [video]: 'generic',
    [codeAllyPractice]: 'codeAlly',
    [codeAllyCert]: 'codeAlly',
    [multifileCertProject]: 'classic',
    [theOdinProject]: 'generic',
    [colab]: 'frontend',
    [exam]: 'exam',
    [msTrophy]: 'msTrophy',
    [multipleChoice]: 'generic',
    [python]: 'modern',
    [dialogue]: 'generic',
    [fillInTheBlank]: 'fillInTheBlank',
    [multifilePythonCertProject]: 'classic',
    [generic]: 'generic',
    [lab]: 'classic',
    [jsLab]: 'classic',
    [pyLab]: 'classic',
    [dailyChallengeJs]: 'classic',
    [dailyChallengePy]: 'classic',
    [examDownload]: 'examDownload',
    [review]: 'generic'
};
// determine the type of submit function to use for the challenge on completion
exports.submitTypes = {
    [html]: 'tests',
    [js]: 'tests',
    [jsProject]: 'tests',
    // requires just a single url
    // like codepen.com/my-project
    [frontEndProject]: 'project.frontEnd',
    // requires two urls
    // a hosted URL where the app is running live
    // project code url like GitHub
    [backEndProject]: 'project.backEnd',
    [pythonProject]: 'project.backEnd',
    [step]: 'step',
    [quiz]: 'tests',
    [backend]: 'backend',
    [modern]: 'tests',
    [video]: 'tests',
    [codeAllyCert]: 'project.frontEnd',
    [multifileCertProject]: 'tests',
    [theOdinProject]: 'tests',
    [colab]: 'project.backEnd',
    [exam]: 'exam',
    [msTrophy]: 'msTrophy',
    [multipleChoice]: 'tests',
    [python]: 'tests',
    [dialogue]: 'tests',
    [fillInTheBlank]: 'tests',
    [multifilePythonCertProject]: 'tests',
    [generic]: 'tests',
    [lab]: 'tests',
    [jsLab]: 'tests',
    [pyLab]: 'tests',
    [dailyChallengeJs]: 'tests',
    [dailyChallengePy]: 'tests',
    [examDownload]: 'examDownload',
    [review]: 'tests'
};
const canSaveToDB = (challengeType) => challengeType === exports.challengeTypes.multifileCertProject ||
    challengeType === exports.challengeTypes.multifilePythonCertProject;
exports.canSaveToDB = canSaveToDB;
exports.dailyCodingChallengeTypes = [
    exports.challengeTypes.dailyChallengeJs,
    exports.challengeTypes.dailyChallengePy
];
const getIsDailyCodingChallenge = (challengeType) => exports.dailyCodingChallengeTypes.includes(challengeType);
exports.getIsDailyCodingChallenge = getIsDailyCodingChallenge;
exports.dailyCodingChallengeLanguages = {
    [exports.challengeTypes.dailyChallengeJs]: 'javascript',
    [exports.challengeTypes.dailyChallengePy]: 'python'
};
const getDailyCodingChallengeLanguage = (challengeType) => exports.dailyCodingChallengeLanguages[challengeType];
exports.getDailyCodingChallengeLanguage = getDailyCodingChallengeLanguage;
