/***
 * Copyright (C) Rodolfo Herrera Hernandez. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project root
 * for full license information.
 *
 * =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
 *
 * For related information - https://github.com/CodeWithRodi/CDrake-SE/
 *
 * CDrake-SE: Open source, ridiculously fast search engine capable of self-hosting built 
 * solely with JavaScript and doses of Modafinil.
 * 
 * -> https://github.com/codewithrodi/CodexDrake/
 * -> https://github.com/codewithrodi/CDrake-SE/
 *
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 ****/

const NodeSuggest = require('node-suggest');

module.exports = async (Query) => ({
    Results: await Promise.any([
        NodeSuggest.google(Query),
        NodeSuggest.ddg(Query),
        NodeSuggest.bing(Query),
        NodeSuggest.qwant(Query),
        NodeSuggest.yahoo(Query),
        NodeSuggest.startpage(Query),
        NodeSuggest.dogpile(Query),
        NodeSuggest.swisscows(Query),
        NodeSuggest.ask(Query),
        NodeSuggest.brave(Query)
    ])
});