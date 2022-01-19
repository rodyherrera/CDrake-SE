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

const Cheerio = require('cheerio');
const Axios = require('axios');
const { kAxiosOptions } = require('../Global');

class QwantEngine{
    constructor({ Query }){
        this.Query = Query;
    }

    GetCheerioInstance = async () => Cheerio.load((
        await Axios.get(`https://www.qwant.com/?t=images&q=${this.Query}`, kAxiosOptions)).data);

    Images = async () => {
        const $ = await this.GetCheerioInstance();
        const Buffer = { Titles: [], Images: [], Sources: [] };
        $('.Images-module__ImagesGridTitle___24asr').each((Index, Element) => Buffer.Titles[Index] = $(Element).text());
        $('.Image-module__ImageBackdrop___2XfGj').each((Index, Element) => Buffer.Images[Index] = $(Element).attr('src'));
        $('.Images-module__ImagesGridLink___8NgTi').each((Index, Element) => Buffer.Sources[Index] = $(Element).text());
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