/***
 * Copyright (C) Rodolfo Herrera Hernandez. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project root
 * for full license information.
 *
 * =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
 *
 * For related information - https://github.com/CodeWithRodi/CDrake-SE/
 *
 * CDrake-SE: Efficient and fast open source search engine built on JavaScript capable of self-hosting.
 * 
 * -> https://github.com/codewithrodi/CodexDrake/
 * -> https://github.com/codewithrodi/CDrake-SE/
 *
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 ****/

const WikipediaRestAPI = require('wikipedia');

class WikipediaEngine{
    constructor({ Query, Language }){
        this.Query = Query;
        this.Language = Language.split('-')[0];
    }

    async Wiki(){
        await WikipediaRestAPI.setLang(this.Language);
        const Data = await WikipediaRestAPI.page(this.Query);
        const { 
            title,
            thumbnail,
            originalimage,
            lang,
            description,
            content_urls,
            extract,
            type
        } = await Data.summary();
        if(type !== 'standard')
            return {
                Status: 'Error'
            };
        return {
            Status: 'Success',
            Title: title,
            Description: description,
            Content: extract,
            Language: lang,
            PDF: (await Data.pdf()),
            References: (await Data.references()),
            Images: (await Data.images()).map(({ title, url }) => ({
                Title: title,
                Link: url
            })),
            Categories: (await Data.categories()).map((Category) => (Category.split(':')[1])),
            Related: (await Data.related()).pages.map(({ normalizedtitle, description, extract }) => ({
                Title: normalizedtitle,
                Description: description,
                Content: extract
            })),
            Thumbnail: {
                Source: thumbnail?.source,
                Width: thumbnail?.width,
                Height: thumbnail?.height
            },
            Image: {
                Source: originalimage?.source,
                Width: originalimage?.width,
                Height: originalimage?.height
            },
            AdditionalURLs: {
                Page: content_urls.desktop.page,
                Revisions: content_urls.desktop.revisions,
                Edit: content_urls.desktop.edit,
                Talk: content_urls.desktop.talk
            }
        };
    };

    Suggest = async () => {
        await WikipediaRestAPI.setLang(this.Language);
        const Data = await WikipediaRestAPI.search(this.Query, {
            suggestion: true,
            limit: 10
        });
        const Buffer = Data.results.map(({ title, pageid }) => ({
            Link: `https://en.wikipedia.org/?curid=${pageid}`,
            Title: title
        }));
        return Buffer;
    }
};

module.exports = WikipediaEngine;