"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rtlLangs = exports.hiddenLangs = exports.LangCodes = exports.LangNames = exports.i18nextCodes = exports.availableLangs = exports.Languages = void 0;
exports.getLangCode = getLangCode;
var Languages;
(function (Languages) {
    Languages["English"] = "english";
    Languages["Espanol"] = "espanol";
    Languages["Chinese"] = "chinese";
    Languages["ChineseTraditional"] = "chinese-traditional";
    Languages["Italian"] = "italian";
    Languages["Portuguese"] = "portuguese";
    Languages["Ukrainian"] = "ukrainian";
    Languages["Japanese"] = "japanese";
    Languages["German"] = "german";
    Languages["Swahili"] = "swahili";
    Languages["Korean"] = "korean";
})(Languages || (exports.Languages = Languages = {}));
/*
 * List of languages with localizations enabled for builds.
 *
 * Client is the UI, and Curriculum is the Challenge Content.
 *
 * An error will be thrown if the CLIENT_LOCALE and CURRICULUM_LOCALE variables
 * from the .env file aren't found in their respective arrays below
 */
exports.availableLangs = {
    client: [
        Languages.English,
        Languages.Espanol,
        Languages.Chinese,
        Languages.ChineseTraditional,
        Languages.Italian,
        Languages.Portuguese,
        Languages.Ukrainian,
        Languages.Japanese,
        Languages.German,
        Languages.Swahili,
        Languages.Korean
    ],
    curriculum: [
        Languages.English,
        Languages.Espanol,
        Languages.Chinese,
        Languages.ChineseTraditional,
        Languages.Italian,
        Languages.Portuguese,
        Languages.Ukrainian,
        Languages.Japanese,
        Languages.German,
        Languages.Swahili,
        Languages.Korean
    ]
};
// ---------------------------------------------------------------------------
// Each client language needs an entry in the rest of the variables below
/* These strings set the i18next language. It needs to be the two character
 * string for the language to take advantage of available functionality.
 * Use a 639-1 code here https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
 */
exports.i18nextCodes = {
    [Languages.English]: 'en',
    [Languages.Espanol]: 'es',
    [Languages.Chinese]: 'zh',
    [Languages.ChineseTraditional]: 'zh-Hant',
    [Languages.Italian]: 'it',
    [Languages.Portuguese]: 'pt-BR',
    [Languages.Ukrainian]: 'uk',
    [Languages.Japanese]: 'ja',
    [Languages.German]: 'de',
    [Languages.Swahili]: 'sw',
    [Languages.Korean]: 'ko'
};
// These are for the language selector dropdown menu in the footer
exports.LangNames = {
    [Languages.English]: 'English',
    [Languages.Espanol]: 'Español',
    [Languages.Chinese]: '中文（简体字）',
    [Languages.ChineseTraditional]: '中文（繁體字）',
    [Languages.Italian]: 'Italiano',
    [Languages.Portuguese]: 'Português',
    [Languages.Ukrainian]: 'Українська',
    [Languages.Japanese]: '日本語',
    [Languages.German]: 'Deutsch',
    [Languages.Swahili]: 'Swahili',
    [Languages.Korean]: '한국어'
};
/* These are for formatting dates and numbers. Used with JS .toLocaleString().
 * There's an example in profile/components/Camper.js
 * List: https://github.com/unicode-cldr/cldr-dates-modern/tree/master/main
 */
exports.LangCodes = {
    [Languages.English]: 'en-US',
    [Languages.Espanol]: 'es-419',
    [Languages.Chinese]: 'zh',
    [Languages.ChineseTraditional]: 'zh-Hant',
    [Languages.Italian]: 'it',
    [Languages.Portuguese]: 'pt-BR',
    [Languages.Ukrainian]: 'uk',
    [Languages.Japanese]: 'ja',
    [Languages.German]: 'de',
    [Languages.Swahili]: 'sw',
    [Languages.Korean]: 'ko'
};
/**
 * This array contains languages that should NOT appear in the language selector.
 */
exports.hiddenLangs = [Languages.Korean];
/**
 * This array contains languages that use the RTL layouts.
 */
exports.rtlLangs = [];
// locale is sourced from a JSON file, so we use getLangCode to
// find the associated enum values
function getLangCode(locale) {
    if (isPropertyOf(exports.LangCodes, locale))
        return exports.LangCodes[locale];
    throw new Error(`${String(locale)} is not a valid locale`);
}
function isPropertyOf(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
