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

const Cheerio = require('cheerio');
const Axios = require('axios');
const { kAxiosOptions } = require('../Global');

class GoogleEngine{
    constructor({ Query, Page, Language }){
        this.Query = Query;
        this.Page = Page;   
        this.Language = Language;
        this.Type = '';
    }
    
    ExtractResultStats(CheerioInstance){
        return (CheerioInstance('#result-stats').map((Index, Element) => {
            // ! Do it better
            let [Results, Timeout] = CheerioInstance(Element).text().split('(');
            Results = Results.replaceAll(',', '').replaceAll('.', '');
            return [
                Results.match(/\d+/g)[1] || Results.match(/\d+/g)[0], 
                Timeout.slice(0, Timeout.indexOf(')')).split(' ')[0]
            ];
        }));
    }

    async GetCheerioInstance(){
        return Cheerio.load((
            await Axios.get(`https://www.google.com/search?q=${this.Query}&start=${(this.Page - 1) * 10}&hl=${this.Language}&tbm=${this.Type}`, kAxiosOptions)).data);
    }

    async Search(){
        const $ = await this.GetCheerioInstance();
        const [TotalIndexedResults, SearchTimeout] = this.ExtractResultStats($);
        const Buffer = { Links: [], Titles: [], Descriptions: [] };
        $('.yuRUbf > div > a').each((Index, Element) => Buffer.Links[Index] = $(Element).attr('href'));
        $('.yuRUbf h3').each((Index, Element) => Buffer.Titles[Index] = $(Element).text());
        $('.VwiC3b').each((Index, Element) => Buffer.Descriptions[Index] = $(Element).text().trim());
        return {
            TotalIndexedResults,
            SearchTimeout,
            Results: Buffer.Links.map((Link, Index) => ({
                Link,
                Title: Buffer.Titles[Index],
                Description: Buffer.Descriptions[Index]
            }))
        }
    };

    async News(){
        this.Type = 'nws';
        const $ = await this.GetCheerioInstance();
        const [TotalIndexedResults, SearchTimeout] = this.ExtractResultStats($);
        const Buffer = { Links: [], Titles: [], Descriptions: [], 
                PublishedDates: [], Images: [], Publishers: [] };
            $('.NUnG9d > span').each((Index, Element) => Buffer.Publishers[Index] = $(Element).text());
        $('div.MBeuO').each((Index, Element) => Buffer.Titles[Index] = $(Element).text());
        $('div.GI74Re').each((Index, Element) => Buffer.Descriptions[Index] = $(Element).text());
        $('.SoaBEf a').each((Index, Element) => Buffer.Links[Index] = $(Element).attr('href'));
        $('.OSrXXb span').each((Index, Element) => Buffer.PublishedDates[Index] = $(Element).text());
        return {
            TotalIndexedResults,
            SearchTimeout,
            Results: Buffer.Links.map((Link, Index) => ({
                Link,
                Title: Buffer.Titles[Index],
                Description: Buffer.Descriptions[Index],
                PublishedAt: Buffer.PublishedDates[Index],
                Publisher: Buffer.Publishers[Index]
            }))
        };
    };

    async Videos(){
        this.Type = 'vid';
        const $ = await this.GetCheerioInstance();
        const [TotalIndexedResults, SearchTimeout] = this.ExtractResultStats($);
        const Buffer = { Titles: [], Links: [], Descriptions: [], 
                        Platforms: [], PublishedDates: [] };
        $('.g div div div .ct3b9e h3').each((Index, Element) => Buffer.Titles[Index] = $(Element).text());
        $('.g div div div .dXiKIc div.Uroaid').each((Index, Element) => Buffer.Descriptions[Index] = $(Element).text());
        $('.g div div div .dXiKIc span.Zg1NU').each((Index, Element) => Buffer.Platforms[Index] = $(Element).text());
        $('.g div div div .dXiKIc span span').each((Index, Element) => Buffer.PublishedDates[Index] = $(Element).text());
        $('.DhN8Cf a').each((Index, Element) => Buffer.Links[Index] = $(Element).attr('href'));
        return {
            TotalIndexedResults,
            SearchTimeout,
            Results: Buffer.Titles.map((Title, Index) => ({
                Title,
                Link: Buffer.Links[Index],
                Description: Buffer.Descriptions[Index],
                Platform: Buffer.Platforms[Index],
                PublishedAt: Buffer.PublishedDates[Index]
            }))
        };
    };

    async Shopping(){
        this.Type = 'shop';
        const $ = await this.GetCheerioInstance();
        const Buffer = { Titles: [], Prices: [], Platforms: [], Links: [] };
        $('a.Lq5OHe').each((Index, Element) => Buffer.Titles[Index] = $(Element).text());
        $('.OFFNJ').each((Index, Element) => Buffer.Prices[Index] = $(Element).text());
        $('.IuHnof').each((Index, Element) => Buffer.Platforms[Index] = $(Element).text())
        $('.C7Lkve > a:first-child').each((Index, Element) => Buffer.Links[Index] = 'https://google.com/' + ($(Element).attr('href')));
        return {
            Results: Buffer.Links.map((Link, Index) => ({
                Link,
                Title: Buffer.Titles[Index],
                Price: Buffer.Prices[Index],
                Platform: Buffer.Platforms[Index]
            }))
        };
    };

    async Books(){
        this.Type = 'bks';
        const $ = await this.GetCheerioInstance();
        const Buffer = { Links: [], Titles: [], Descriptions: [], 
                        Publishers: [], PublishedDates: [], Images: [] };
        $('.DKV0Md').each((Index, Element) => Buffer.Titles[Index] = $(Element).text());
        $('.N96wpd > :first-child').each((Index, Element) => Buffer.Publishers[Index] = $(Element).text());
        $('.N96wpd > span:nth-of-type(1)').each((Index, Element) => {
            const MaybePublishedDate = $(Element).text();
            Buffer.PublishedDates[Index] = (!isNaN(MaybePublishedDate)) ? (MaybePublishedDate) : undefined;
        });
        $('.rGhul').each((Index, Element) => Buffer.Links[Index] = $(Element).attr('href'));
        $('.cmlJmd > :last-child').each((Index, Element) => Buffer.Descriptions[Index] = $(Element).text());
        return {
            Results: Buffer.Links.map((Link, Index) => ({
                Link,
                Title: Buffer.Titles[Index],
                Description: Buffer.Descriptions[Index],
                Publisher: Buffer.Publishers[Index],
                PublishedAt: Buffer.PublishedDates[Index]
            })) 
        };
    };
};

module.exports = GoogleEngine;