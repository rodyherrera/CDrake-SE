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

const Cheerio = require('cheerio');
const Axios = require('axios');
const { kAxiosOptions } = require('../Global');

class AskEngine{
    constructor({ Query, Page }){
        this.Query = Query;
        this.Page = Page;
    }

    ExtractResultStats(CheerioInstance){
        return (CheerioInstance('.PartialResultsHeader-summary').map((_, Element) => {
            const Results = CheerioInstance(Element).text().replaceAll(',', '').replaceAll('.', '').match(/\d+/g)[2];
            return Results;
        }));
    }

    async GetCheerioInstance(){
        return Cheerio.load((
            await Axios.get(`https://www.ask.com/web?o=0&l=dir&qo=pagination&q=${this.Query}&qsrc=998&page=${this.Page}`, kAxiosOptions)).data);
    }

    async Search(){
        const $ = await this.GetCheerioInstance();
        const TotalIndexedResults = this.ExtractResultStats($)[0];
        const Buffer = { Links: [], Titles: [], Descriptions: [] };
        $('.result-link').each((Index, Element) => Buffer.Titles[Index] = $(Element).text());
        $('.PartialSearchResults-item-url').each((Index, Element) => Buffer.Links[Index] = $(Element).text());
        $('.PartialSearchResults-item-abstract').each((Index, Element) => Buffer.Descriptions[Index] = $(Element).text());
        return {
            TotalIndexedResults,
            Results: Buffer.Links.map((Link, Index) => ({
                Link,
                Title: Buffer.Titles[Index],
                Description: Buffer.Descriptions[Index]
            }))
        };
    }
};

module.exports = AskEngine;