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

class YahooEngine{
    constructor({ Query, Language, Page }){
        this.Query = Query.toLowerCase();
        this.Language = Language;
        this.Page = Page;
        this.Type = '';
    }

    ExtractResultStats(CheerioInstance){
        return (CheerioInstance('.searchSuperTop').map((Index, Element) => {
            // ! Do it better
            const Results = CheerioInstance(Element).text().replaceAll(',', '').replaceAll('.', '').match(/\d+/g)[0];
            return Results;
        }));
    }

    async GetCheerioInstance(){
        let Endpoint = `https://search.yahoo.com/search?q=${this.Query}&ei=UTF-8&nojs=1&b=${(this.Page - 1) * 10}`;
        if(this.Type === 'Video')
            Endpoint = `https://video.search.yahoo.com/search/video;_ylt=AwrC5pn.SN9huAcANVf7w8QF;_ylu=c2VjA3NlYXJjaAR2dGlkAw--?p=${this.Query}`
        else if(this.Type === 'News')
            Endpoint = `https://news.search.yahoo.com/search;_ylt=AwrDQ2p8VN9hxV8ApwD7w8QF?p=${this.Query}&b=${(this.Page - 1)}1`;
        else if(this.Type === 'Shopping')
            Endpoint = `https://shopping.yahoo.com/search?&p=${this.Query}`;
        return Cheerio.load((await Axios.get(Endpoint, kAxiosOptions)).data);
    }

    async Search(){
        const $ = await this.GetCheerioInstance();
        const TotalIndexedResults = this.ExtractResultStats($)[0];
        const Buffer = { Links: [], Titles: [], Descriptions: [] };
        $('.options-toggle > .title > a > span').each((Index, Element) => Buffer.Links[Index] = $(Element).text().replaceAll('›', '/').replaceAll(/\s/g,''));
        $('.options-toggle > .title > a > span').each((Index, Element) => $(Element).remove());
        $('.options-toggle > .title').each((Index, Element) => Buffer.Titles[Index] = $(Element).text());
        $('.compText > p > span:last-child').each((Index, Element) => Buffer.Descriptions[Index] = $(Element).text());
        return {
            TotalIndexedResults,
            Results: Buffer.Links.map((Link, Index) => ({
                Link,
                Title: Buffer.Titles[Index],
                Description: Buffer.Descriptions[Index]
            }))
        };
    };

    async Videos(){
        this.Type = 'Video';
        const $ = await this.GetCheerioInstance();
        const Buffer = { Titles: [], Links: [], PublishedDates: [] };
        $('li h3').each((Index, Element) => Buffer.Titles[Index] = $(Element).text());
        $('div.v-age').each((Index, Element) => Buffer.PublishedDates[Index] = $(Element).text());
        $('.vres a:first-child').each((Index, Element) => Buffer.Links[Index] = $(Element).attr('href'));
        return {
            Results: Buffer.Links.map((Link, Index) => ({
                Link,
                Title: Buffer.Titles[Index],
                PublishedAt: Buffer.PublishedDates[Index]
            }))
        };
    };

    async News(){
        this.Type = 'News';
        const $ = await this.GetCheerioInstance();
        const Buffer = { Titles: [], Links: [], Descriptions: [], 
                    Images: [], Publishers: [], PublishedDates: [] };
        $('.s-img').each((Index, Element) => Buffer.Images[Index] = $(Element).attr('src'));
        $('.s-source').each((Index, Element) => Buffer.Publishers[Index] = $(Element).text());
        $('.s-time').each((Index, Element) => Buffer.PublishedDates[Index] = $(Element).text().slice(2));
        $('.s-desc').each((Index, Element) => Buffer.Descriptions[Index] = $(Element).text());
        $('.s-title > :first-child').each((Index, Element) => {
            Buffer.Titles[Index] = $(Element).text();
            Buffer.Links[Index] = $(Element).attr('href');
        });
        return {
            Results: Buffer.Links.map((Link, Index) => ({
                Link,
                Title: Buffer.Titles[Index],
                Description: Buffer.Descriptions[Index],
                Image: Buffer.Images[Index],
                Publisher: Buffer.Publishers[Index],
                PublishedAt: Buffer.PublishedDates[Index]
            }))
        };
    };

    async Shopping(){
        this.Type = 'Shopping';
        const $ = await this.GetCheerioInstance();
        const Buffer = { Titles: [], Prices: [], Platforms: [], Links: [] };
        $('span.FluidProductCell__PriceText-sc-fsx0f7-10').each((Index, Element) => Buffer.Prices[Index] = $(Element).text());
        $('span.FluidProductCell__Title-sc-fsx0f7-9').each((Index, Element) => Buffer.Titles[Index] = $(Element).text());
        $('span.FluidProductCell__MerchantInfo-sc-fsx0f7-8').each((Index, Element) => Buffer.Platforms[Index] = $(Element).text());
        $('a.unstyled-link').each((Index, Element) => Buffer.Links[Index] = 'https://shopping.yahoo.com/' + $(Element).attr('href'));
        return {
            Results: Buffer.Links.map((Link, Index) => ({
                Link,
                Title: Buffer.Titles[Index],
                Price: Buffer.Prices[Index],
                Platform: Buffer.Platforms[Index]
            }))
        };
    };
};

module.exports = YahooEngine;
