const YoutubeSearchAPI = require('youtube-search-api');

class YoutubeEngine{
    // Types => [Video, Channel, Playlist, Movie]
    constructor({ Query, Limit, AllowPlaylist, Type = 'Video' }){
        this.Query = Query;
        this.Limit = Limit;
        this.AllowPlaylist = AllowPlaylist;
        this.Type = Type;
    }

    FilterResults(Results){
        return {
            Results: Results.map((Item) => ({
                VideoID: Item.id,
                Thumbnails: (Item?.thumbnail?.thumbnails || Item?.thumbnail)?.map((Thumbnail) => ({
                    URL: Thumbnail.url,
                    Width: Thumbnail.width,
                    Height: Thumbnail.height
                })),
                Type: Item.type,
                Title: Item.title,
                Channel: Item.channelTitle,
                IsLive: Item.isLive,
                Duration: Item.length.simpleText
            }))
        };
    }

    async Search(Query){
        const Results = await YoutubeSearchAPI.GetListByKeyword(Query || this.Query, 
            this.AllowPlaylist, this.Limit, [{ type: this.Type.toLowerCase() }]);
        return {
            ...this.FilterResults(Results.items),
            NextPageContext: Results.nextPage
        };
    }

    async GetPlaylist(PlaylistID){
        const Results = await YoutubeSearchAPI.GetPlaylistData(PlaylistID || this.Query, this.Limit);
        return {
            ...this.FilterResults(Results.items),
            PlaylistTitle: Results.metadata.playlistMetadataRenderer.title
        };
    }

    async GetSuggestedVideos(){
        const Results = await YoutubeSearchAPI.GetSuggestData(this.Limit);
        return {
            ...this.FilterResults(Results.items)
        }
    }

    async GetVideoDetails(VideoID){
        const Data = await YoutubeSearchAPI.GetVideoDetails(VideoID || this.Query);
        return {
            Title: Data.title,
            IsLive: Data.isLive,
            Channel: Data.channel,
            Description: Data.description,
            Related: this.FilterResults(Data.suggestion)
        };
    }

    async NextPage(NextPageData){
        const Results = await YoutubeSearchAPI.NextPage(NextPageData, this.AllowPlaylist, this.Limit);
        return {
            ...this.FilterResults(Results.items),
            NextPageContext: Results.nextPage
        };
    }
};

module.exports = YoutubeEngine;