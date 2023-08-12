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

class QwantEngine{
    constructor({ Query }){
        this.Query = Query;
    }

    async GetCheerioInstance(){
        return Cheerio.load((
            await Axios.get(`https://www.qwant.com/?t=images&q=${this.Query}`, kAxiosOptions)).data);
    }

    async Images(){
        const $ = await this.GetCheerioInstance();
        const Buffer = { Titles: [], Images: [], Sources: [] };
        $('h2').each((Index, Element) => Buffer.Titles[Index] = $(Element).text());
        $('a img').each((Index, Element) => Buffer.Images[Index] = $(Element).attr('src'));
        $('._2XdD5').each((Index, Element) => Buffer.Sources[Index] = $(Element).text());
        return {
            Results: Buffer.Images.map((Image, Index) => ({
                Image,
                Title: Buffer.Titles[Index],
                Source: Buffer.Sources[Index]
            }))
        };
    };
};

module.exports = QwantEngine;