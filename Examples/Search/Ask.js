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

const AskEngine = require('../../Engines/Ask');

(async () => {
    const Instance = new AskEngine({ Query: 'Elon Musk', Page: 1 });
    console.log(await Instance.Search());
})();
