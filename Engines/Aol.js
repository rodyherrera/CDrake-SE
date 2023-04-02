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

const Cheerio = require('cheerio');
const Axios = require('axios');
const { kAxiosOptions } = require('../Global');

class AolEngine{
    constructor({ Query, Page }){
        this.Query = Query;
        this.Page = Page;
        this.Type = '';
    }

    GetCheerioInstance = async () => {
        let Endpoint = `https://search.aol.com/aol/search?q=${this.Query}&b=${(this.Page - 1) * 10}`;
        if(this.Type === 'Images')
            Endpoint = `https://search.aol.com/aol/image;_ylt=AwrJ6STZf99hsP4ADWppCWVH;_ylu=Y29sbwNiZjEEcG9zAzEEdnRpZAMEc2VjA3BpdnM-?q=${this.Query}&b=${(this.Page - 1) * 10}`;
        else if(this.Type === 'Videos')
            Endpoint = `https://search.aol.com/aol/video;_ylt=AwrExlSngN9h8gQAvpBjCWVH?q=${this.Query}&b=${(this.Page - 1) * 10}`;
        return Cheerio.load((
            await Axios.get(Endpoint, kAxiosOptions)).data);
    }

    ExtractResultStats = (CheerioInstance) =>
    (CheerioInstance('.fz-13').map((Index, Element) => {
        let Results = CheerioInstance(Element).text().replaceAll(',', '').replaceAll('.', '').match(/\d+/g)[0];
        return Results;
    }));

    Images = async () => {
        this.Type = 'Images';
        const $ = await this.GetCheerioInstance();
        const Buffer = { Titles: [], Images: [], Sources: [] };
        $('.img').each((Index, Element) => {
            Buffer.Titles[Index] = $(Element).attr('aria-label');
            Buffer.Sources[Index] = $(Element).attr('href');
        });
        $('.img > img').each((Index, Element) => Buffer.Images[Index] = $(Element).attr('data-src'));
        return {
            Results: Buffer.Images.map((Image, Index) => ({
                Image,
                Title: Buffer.Titles[Index],
                Source: Buffer.Sources[Index]
            }))
        };
    };

    Videos = async () => {
        this.Type = 'Videos';
        const $ = await this.GetCheerioInstance();
        const Buffer = { Titles: [], Links: [], PublishedDates: [], Platforms: [] };
        $('h3').each((Index, Element) => Buffer.Titles[Index] = $(Element).text());
        $('.v-age').each((Index, Element) => Buffer.PublishedDates[Index] = $(Element).text());
        $('.vr > a').each((Index, Element) => Buffer.Links[Index] = $(Element).attr('href'));
        $('.url').each((Index, Element) => Buffer.Platforms[Index] = $(Element).text());
        return {
            Results: Buffer.Links.map((Link, Index) => ({
                Link,
                Title: Buffer.Titles[Index],
                PublishedAt: Buffer.PublishedDates[Index],
                Platform: Buffer.Platforms[Index]
            }))
        };
    };

    Search = async () => {
        const $ = await this.GetCheerioInstance();
        const TotalIndexedResults = this.ExtractResultStats($)[0];
        const Buffer = { Links: [], Titles: [], Descriptions: [] };
        $('.lh-24').each((Index, Element) => Buffer.Titles[Index] = $(Element).text());
        $('.lh-17').each((Index, Element) => Buffer.Links[Index] = $(Element).text());
        $('.lh-16').each((Index, Element) => Buffer.Descriptions[Index] = $(Element).text());
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

module.exports = AolEngine;