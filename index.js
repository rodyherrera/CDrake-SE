/***
 * Copyright (C) Rodolfo Herrera Hernandez. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project root
 * for full license information.
 *
 * =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
 *
 * For related information - https://github.com/rodyherrera/CDrake-SE/
 *
 * CDrake-SE: Efficient and fast open source search engine built on JavaScript capable of self-hosting.
 * 
 * -> https://github.com/rodyherrera/CodexDrake/
 * -> https://github.com/rodyherrera/CDrake-SE/
 *
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 ****/

const GoogleEngine = require('./Engines/Google');
const YahooEngine = require('./Engines/Yahoo');
const QwantEngine = require('./Engines/Qwant');
const AolEngine = require('./Engines/Aol');
const AskEngine = require('./Engines/Ask');
const BingEngine = require('./Engines/Bing');
const SuggestEngine = require('./Engines/Suggest');
const WikipediaEngine = require('./Engines/Wikipedia');
// const YepEngine = require('./Engines/Yep');

module.exports = async ({ Method, Query, Page = 1, Language = 'en-US' }) => {
    const Arguments = { Query, Page, Language };
    const Instances = {
        Bing: new BingEngine(Arguments),
        Google: new GoogleEngine(Arguments),
        Yahoo: new YahooEngine(Arguments),
        Qwant: new QwantEngine(Arguments),
        Aol: new AolEngine(Arguments),
        Ask: new AskEngine(Arguments),
        Wikipedia: new WikipediaEngine(Arguments)
    };
    let Results = [];
    if(Method === 'Images')
        Results = await Promise.any([
            Instances.Qwant.Images(),
            Instances.Aol.Images()
        ]);
    else if(Method === 'Books')
        Results = await Promise.any([
            Instances.Google.Books()
        ]);
    else if(Method === 'Wikipedia')
        Results = await Promise.any([
            Instances.Wikipedia.Wiki()
        ]);
    else if(Method === 'Wikipedia.Suggest')
        Results = await Promise.any([
            Instances.Wikipedia.Suggest()
        ]);
    else if(Method === 'Suggest')
        Results = await SuggestEngine(Query);
    else if(Method === 'Search')
        Results = await Promise.any([
            Instances.Bing.Search(),
            Instances.Google.Search(),
            Instances.Aol.Search(),
            Instances.Yahoo.Search(),
            Instances.Ask.Search()
        ]);
    else if('Videos' === Method)
        Results = await Promise.any([
            Instances.Google.Videos(),
            Instances.Aol.Videos(),
            Instances.Yahoo.Videos()
        ])
    else if('News' === Method)
        Results = await Promise.any([
            Instances.Google.News(),
            Instances.Yahoo.News(),
            Instances.Bing.News()
        ]);
    else if('Shopping' === Method)
        Results = await Promise.any([
            Instances.Google[Method](),
            Instances.Yahoo[Method]()
        ]);
    return { Results };
};
