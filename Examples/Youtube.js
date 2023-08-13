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
const YoutubeEngine = require('../Engines/Youtube');

(async function(){
    const Instance = new YoutubeEngine({ Limit: 5, Type: 'Video', AllowPlaylist: true });

    const SearchResults = await Instance.Search('Elon Musk');
    console.log(SearchResults);

    const NextPageSearchResult = await Instance.NextPage(SearchResults.NextPageContext);
    console.log(NextPageSearchResult);

    // await Instance.NextPage(NextPageSearchResult.NextPageContext) ...

    const SuggestedVideos = await Instance.GetSuggestedVideos(); 
    console.log(SuggestedVideos);

    const VideoDetails = await Instance.GetVideoDetails('hWhMKalEicY');
    console.log(VideoDetails);

    const PlaylistDetails = await Instance.GetPlaylist('RDCLAK5uy_lGZNsVQescoTzcvJkcEhSjpyn_98D4lq0');
    console.log(PlaylistDetails);
})();