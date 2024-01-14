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

class BingEngine{
    constructor({ Query, Language, Page = 1 }){
        this.Query = Query;
        this.Type = '';
        this.Page = Page;
        this.Language = Language;
    }

    async GetCheerioInstance(){
        const Endpoint = (this.Type === 'News') 
            ? (`https://bing.com/news/search?go=Search&qs=ds&form=QBNT`)
            : (`https://bing.com/search?go=Search&qs=ds&form=QBRE`);
        return Cheerio.load((await Axios.get(Endpoint + `&q=${this.Query}&first=${this.Page}1&setlang=${this.Language}`, kAxiosOptions)).data);
    }

    async Search(){
        this.Type = 'Search';
        const $ = await this.GetCheerioInstance();
        const Buffer = { Links: [], Titles: [], Descriptions: [], RelatedSearchs: [], TotalIndexedResults: 0 };
        $('.sb_count').each((_, Element) => Buffer.TotalIndexedResults = $(Element).text().match(/[\d,\.]+/g)[2].replace(/[^\d,\.]/g, ''));
        $('li.b_algo h2 a').each((Index, Element) => {
            Buffer.Titles[Index] = $(Element).text();
            Buffer.Links[Index] = $(Element).attr('href');
        });
        $('li.b_algo p').each((Index, Element) => Buffer.Descriptions[Index] = $(Element).text());
        $('.b_rs a').each((Index, Element) => Buffer.RelatedSearchs[Index] = $(Element).text());
        return {
            TotalIndexedResults: Buffer.TotalIndexedResults,
            RelatedSearchs: Buffer.RelatedSearchs,
            Results: Buffer.Links.map((Link, Index) => ({
                Link,
                Title: Buffer.Titles[Index],
                Description: Buffer.Descriptions[Index]
            }))
        };
    }

    async News(){
        this.Type = 'News';
        const $ = await this.GetCheerioInstance();
        const Buffer = { Links: [], Titles: [], Descriptions: [], 
            Publishers: [], PublishedDates: [], Images: [], TotalIndexedResults: 0 };
        $('.rc').each((_, Element) => Buffer.TotalIndexedResults = $(Element).text().match(/^[\d,]+\.\d+/)[0])
        $('a.title').each((Index, Element) => {
            Buffer.Titles[Index] = $(Element).text();
            Buffer.Links[Index] = $(Element).attr('href');
        });
        $('div.snippet').each((Index, Element) => Buffer.Descriptions[Index] = $(Element).text());
        $('.source a').each((Index, Element) => Buffer.Publishers[Index] = $(Element).text() || undefined);
        $('.source span[tabindex]').each((Index, Element) => Buffer.PublishedDates[Index] = $(Element).text());
        $('.imagelink img').each((Index, Element) => {
            const ImageSource = $(Element).attr('data-src');
            const ImageSourceHQ = $(Element).attr('data-src-hq');
            Buffer.Images[Index] = (ImageSourceHQ) ? (ImageSourceHQ.slice(2)) : ('bing.com' + ImageSource);
        });
        return {
            TotalIndexedResults: Buffer.TotalIndexedResults,
            Results: Buffer.Links.map((Link, Index) => ({
                Link,
                Title: Buffer.Titles[Index],
                Description: Buffer.Descriptions[Index],
                Publisher: Buffer.Publishers[Index],
                PublishedAt: Buffer.PublishedDates[Index],
                Image: Buffer.Images[Index]
            }))
        };
    }
};

module.exports = BingEngine;