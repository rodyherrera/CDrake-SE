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

const Axios = require('axios');
const { kAxiosOptions } = require('../Global');

const RemoveHTMLFromString = (String) => String.replace(/(<([^>]+)>)/gi, '');

class YepEngine{
    constructor({ Query, Page, Language }){
        this.Query = Query;
        this.Page = Page;
        this.Language = Language;
    };

    async GetEngineResponse(){
        return ((await Axios.get(`https://api.yep.com/fs/2/search?client=web&no_correct=false&q=${this.Query}&safeSearch=off&type=${this.Type}`, kAxiosOptions)).data[1]);
    };

    async News(){
        this.Type = 'news';
        const Response = await this.GetEngineResponse();
        const Buffer = { Links: [], Titles: [], Descriptions: [], Images: [] };
        Response.results.forEach((Result, Index) => {
            Buffer.Links[Index] = Result.url;
            Buffer.Titles[Index] = Result.title;
            Buffer.Descriptions[Index] = RemoveHTMLFromString(Result.snippet);
            Buffer.Images[Index] = Result.img;
        });
        return {
            Results: Buffer.Links.map((Link, Index) => ({
                Link,
                Title: Buffer.Titles[Index],
                Description: Buffer.Descriptions[Index],
                Image: Buffer.Images[Index]
            }))
        };
    };

    async Search(){
        this.Type = 'web';
        const Response = await this.GetEngineResponse();
        const Buffer = { Links: [], Titles: [], Descriptions: [], TotalIndexedResults: 0 };
        Response.results.forEach((Result, Index) => {
            Buffer.Links[Index] = Result.url;
            Buffer.Titles[Index] = Result.title;
            Buffer.Descriptions[Index] = RemoveHTMLFromString(Result.snippet);
        });
        return {
            TotalIndexedResults: Response.total,
            Results: Buffer.Links.map((Link, Index) => ({
                Link,
                Title: Buffer.Titles[Index],
                Description: Buffer.Descriptions[Index]
            }))
        };
    };
};

module.exports = YepEngine;