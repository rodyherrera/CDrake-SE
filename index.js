/***
 * Copyright (C) Rodolfo Herrera Hernandez. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project root
 * for full license information.
 *
 * =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
 *
 * For related information - https://github.com/CodeWithRodi/CDrake-SE/
 *
 * CDrake-SE- Fast, secure, private search engine using scrape, built 
 * in JavaScript by a professional water drinker haha ​​<3.
 *
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 ****/

const GoogleEngine = require('./Engines/Google');
const YahooEngine = require('./Engines/Yahoo');
const QwantEngine = require('./Engines/Qwant');
const AolEngine = require('./Engines/Aol');
const AskEngine = require('./Engines/Ask');
const SuggestEngine = require('./Engines/Suggest');

module.exports = async ({ Method, Query, Page = 1, Language = 'en-US' }) => {
    // ! Do it better
    const Arguments = { Query, Page, Language };
    const Instances = {
        Google: new GoogleEngine(Arguments),
        Yahoo: new YahooEngine(Arguments),
        Qwant: new QwantEngine(Arguments),
        Aol: new AolEngine(Arguments),
        Ask: new AskEngine(Arguments),
    };
    if(Method === 'Images')
        return await Promise.any([
            Instances.Qwant.Images(),
            Instances.Aol.Images()
        ]);
    else if(Method === 'Books')
        return await Promise.any([
            Instances.Google.Books()
        ]);
    else if(Method === 'Suggest')
        return await SuggestEngine(Query);
    else if(Method === 'Search')
        return await Promise.any([
            Instances.Google.Search(),
            Instances.Aol.Search(),
            Instances.Yahoo.Search(),
            Instances.Ask.Search()
        ]);
    else if('Videos' === Method)
        return await Promise.any([
            Instances.Google.Videos(),
            Instances.Aol.Videos(),
            Instances.Yahoo.Videos()
        ])
    else if(['News', 'Shopping'].includes(Method))
        return await Promise.any([
            Instances.Google[Method](),
            Instances.Yahoo[Method]()
        ]);
    return { Results: [] };
};
