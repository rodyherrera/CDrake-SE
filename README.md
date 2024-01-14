# CDrake-SE
<a href="https://ko-fi.com/codewithrodi"> 
    <img align="left" src="https://cdn.ko-fi.com/cdn/kofi3.png?v=3" height="50" width="200" alt="Donate - Contribute" />
</a>

<br /> <br />
##### A library that will make your life easier when you want to search the internet, not pay APIs, search from your computer for free!

This library allows you to search in various internet search engines, you can search for news, images, videos, items to buy and books, the results can be paginated and filtered by language in some engines, it is quite complete, we even have our own web service to browse the internet, also written in NodeJS using this library, below it will be explained how you can use and perform searches in a couple of lines of code.
It is important to note that the results obtained from this library when performing searches will depend on the location where the script is being executed, the results will be different if you are testing the library in the United States than in Chile, in this case, this library was developed in Chile, where all categories work without any problem.

Previously it was mentioned to you that we had a web service that works thanks to this library, go through the demo! [https://codexdrake.rodyherrera.com/](https://codexdrake.rodyherrera.com "CodexDrake Web Search Engine")

### Installation
Before we explain how to use this library, we must first start by installing it, it is quite easy and you only have to execute a line of code in your terminal

It is important that you follow each instruction given to you step by step, because if you skip one or apply a bad configuration you will have problems with the correct deployment of the software.

```bash
# <In the folder of your project where the package.json is located>
npm i cdrake-se
```
After executing the command, the installation of the package will be initialized, once finished we will create a file, in which you will experiment with the examples that we will give you.
```bash
# Valid command for MacOS and Linux, if you are on windows create a file as it should :)
touch Search.js
```
Once the command is executed, a file will be created for you, then we recommend that you open your preferred code editor to start experimenting!

### Using automatic search
First we will start with the simple, the easy and fast, the automatic search allows you to search according to a category that you indicate, it will try all the engines in which the indicated category is available, the first one that responds to the request will be the answer that is back, it is recommended to use the automatic search in production, in real cases, if you saw our demo, our web service, it works with the automatic search, you can see the source code of it, we literally used two lines of code.
```javascript
// ! Requiring the library to be able to do the search
const SearchEngine = require('cdrake-se');

// ! Creating an asynchronous function that will be executed 
// ! automatically when the script is initialized, which will 
// ! search for information and display it on the screen
(async function(){
    try{
        const Response = await SearchEngine({ 
            // ! The method means what category you want to search for, in this case 
            // ! we say Search, which is the equivalent of Google's 'All' category, that 
            // ! is, it will bring you the title of the page, the description and its access link.
            Method: 'Search', 
            // ! What do we want to search for? We want to search for pages related to Elon Musk
            Query: 'Elon Musk', 
            // ! We tell it to bring us the results of page number 1, the results are 
            // ! paginated, we must indicate which page we want to obtain.
            Page: 1,
            // ! Language for the search
            Language: 'en-US'
        });
        // ! Once the search is finished, we show the data in the terminal
        console.log(Response);
    }catch(SearchRuntimeError){
        // ! If an error occurs with the search, the error will be displayed, it is 
        // ! likely that after a huge number of requests, an HTTP 429 error can be 
        // ! returned, which basically means that many requests are being made from 
        // ! your IP address, it is difficult, because we have several alternating 
        // ! motors in case one fails!
        console.log(SearchRuntimeError);
    }
}())
```
If you copy and paste the code in the file that you previously created, when you run it the search will be done, you will see in your terminal an array of objects whose keys will be 3, the first will be 'Link' that will indicate the link of the site related to the search, in this case Elon Musk, the second will be 'Title' which will be the title of the page and finally we have 'Description', it is likely that you will not only have the array of objects, since there are some engines that return the amount of indexed results and the time it took to find the results, these keys are identified as 'TotalIndexedResults' which will indicate the total number of results detected along with 'SearchTimeout' which will be the time in milliseconds that the search engine used took to find the indexed results, both keys are found in the object header if both are provided by the engine.

### Methods
As you could tell, in the example code when executing the automatic search, we send an object with several values, it is not necessary to explain them here because they were explained in the same code, but if it is necessary to explain the available methods, they will help you to perform searches between different categories.
| Method | Description |
| ------ | ------ |
| Search | It allows you to search for pages related to what you are requesting to search. |
| Images | Search for images related to what you are requesting to search. |
| Books | It allows you to search for related books based on what you are requesting to search for. |
| Suggest | It returns an array usually of 10 elements whose are strings, which are autocompleted based on what you are sending in the 'Query' parameter, for example assuming that the 'Query' is 'How', the first index of the return of the automatic call whose method is 'Suggest' will be something like 'How convert a horse to unicorn'. |
| Videos | It allows you to search for videos based on what you are requesting. |
| News | It allows you to find news based on what you are requesting. |
| Shopping | It allows you to find shopping items related to what you are looking for. |

### Return of the different categories
#### Search
| Parameter | Description |
| ------ | ------ |
| TotalIndexedResults | Contains the number of indexed results related to your search, this parameter will not always be present in your searches. |
| SearchTimeout | It tells you the amount of time that the used engine took to find the return results, this value will usually be in milliseconds, it will not always be present in the return values. |
| Results | It is an array of objects that will contain the results of the search for related pages, the object of the array will contain 'Link' whose value will be the link of the related page, it will have 'Title' whose value will be the title of the related page and finally It will have 'Description' which will be the description of the page related to the requested search.|

#### Images
| Parameter | Description |
| ------ | ------ |
| Results | Returns an array with objects that will be the results of what was requested to search, the object will have 3 values ​​where the first will be 'Source' that will indicate the source from which the image came, the second parameter will be 'Title' that will indicate the title of the image and finally we have the parameter 'Image' that will indicate the page of the image, that is to say where the image is hosted, the value that should be in your <img src='' /> |

#### Books
| Parameter | Description |
| ------ | ------ |
| Results | Returns an arary with objects whose has 5 keys, where the first called 'Link' will be the purchase link for the book, the second 'Title' will be the title of the book, 'Description' will be the description of the book, 'Publisher' as the seller of the book and finally 'PublishedAt' which will be the publication date of the book sale. |

#### Suggest
| Parameter | Description |
| ------ | ------ |
| Results | Returns an array of strings whose length will generally be 10, these strings will contain as a value possible matches with the requested search, with the value of the 'Query', for example if your value in 'Query' is 'How to' is It is possible that one of the 10 elements returned by the method contains a string with 'How to hack the nasa with HTML', basically it is an autocomplete. |

#### Videos
| Parameter | Description |
| ------ | ------ |
| TotalIndexedResults | Contains the number of indexed results related to your search, this parameter will not always be present in your searches. |
| SearchTimeout | It tells you the amount of time that the used engine took to find the return results, this value will usually be in milliseconds, it will not always be present in the return values. |
| Results | It will be an array of objects that will have the results of the related videos based on your search, the object contains a non-constant amount of keys, because it will depend on the engine to use, but here all of them will be explained to you, the first one will be 'Link ', which will indicate the Link of the video, 'Title' will indicate the title of the video, 'Description' will indicate the description of the video, 'Platform' will be the platform where the video is hosted, 'PublishedAt' will be the publication date of the video. |

#### News
| Parameter | Description |
| ------ | ------ |
| TotalIndexedResults | Contains the number of indexed results related to your search, this parameter will not always be present in your searches. |
| SearchTimeout | It tells you the amount of time that the used engine took to find the return results, this value will usually be in milliseconds, it will not always be present in the return values. |
| Results | It will be an array of objects that will have the results of news related to your search, the length of the keys of the objects will not be constant since it will depend on the engine, but all of them will be explained here, the first one will be 'Link' that will contain the link of the news, the second will be 'Title' which will contain the title of the news, 'Description' will contain the description of the news, 'Image' will contain the image of the news, 'Publisher' the publisher of the news and finally ' PublishedAt' which will be the date the news was published. |

#### Shopping
| Parameter | Description |
| ------ | ------ |
| Results | It will be an array of objects that will have the results of purchase items related to the search you are performing, the keys are 4 where the first is 'Link' which contains as value the link to access the purchase item, the second is 'Title ' which will be the title of the article, the third 'Price' will be the price of the article and finally 'Platform' which will be the platform that sells the article. |

### Auto Complete Example
Next you will be shown an example of the autocomplete, remember that the idea is that you test the code that is presented to you in the file that you previously created
```javascript
// ! Requiring the library to be able to do the search
const SearchEngine = require('cdrake-se');

// ! Creating an asynchronous function that will be executed 
// ! automatically when the script is initialized, which will 
// ! search for information and display it on the screen
(async function(){
    try{
        const AutoCompleteResults = await SearchEngine({
            // ! Indicating the query so that it auto completes us with possible results
            Query: 'How to',
            // ! We indicate that we use the Suggest method to obtain suggestions about the query
            Method: 'Suggest',
            // ! We do not indicate page, it is useless, nor language, although both are 
            // ! optional parameters, default page is 1 and default language is 'en-US'
        });
        // ! We show the possible results on the screen
        console.log(AutoCompleteResults);
    }catch(SearchRuntimeError){
        // ! In case an error occurs, we will show it on the screen.
        console.log(AutoCompleteResults);
    }
}());
```
### Using specific engines
Previously I told you about the automatic search, you could not choose which engines you wanted to use to perform the search, keep in mind that not all engines support all search categories, that is why it is recommended to use the automatic search to avoid headaches, but here you will be shown examples using specific engines.
| Engine | Supported Categories |
| ------ | ------ |
| Aol | Search, Videos and Images |
| Ask | Search |
| Google | Books, Shopping, Videos, News and Search |
| Qwant | Images |
| Yahoo | Shopping, News, Videos and Search |

### Example using specific engines
```javascript
// * const AolEngine = require('cdrake-se/Engines/Aol');
// * const AskEngine = require('cdrake-se/Engines/Ask');
// * const QwantEngine = require('cdrake-se/Engines/Qwant');
// * const YahooEngine = require('cdrake-se/Engines/Yahoo');

// ! Requiring the google engine, if you notice in the other commented lines 
// ! there are the other engines available :), in this example we 
// ! will use the Google engine.
const GoogleEngine = require('cdrake-se/Engines/Google');

// ! Creating an asynchronous function that will be executed 
// ! automatically when the script is initialized, which will 
// ! search for information and display it on the screen
(async function(){
    try{
        // ! Creating an instance of the engine class, all engines generally 
        // ! must receive the same parameters as Google, they all receive a 
        // ! Query, and some the page next to the language in which you 
        // ! want to perform the search, once we have created the instance 
        // ! with the data, we can access the methods that were made known 
        // ! to you in the last table.
        const GoogleInstance = new GoogleEngine({
            // ! What do we want to search for in Google?
            Query: 'Elon Musk',
            // ! What page do we want to bring?
            Page: 1,
            // ! In what language do we want to perform the search?
            Language: 'en-US'
        });
        
        // * const Books = await GoogleInstance.Books();
        // * const Videos = await GoogleInstance.Videos();
        // * const Shopping = await GoogleInstance.Shopping();
        // * const News = await GoogleInstance.News();

        // ! In this case we will use the method that will bring us pages 
        // ! related to what we are looking for, if you realize in the commented 
        // ! lines they are the methods that came out in the last table available 
        // ! for google, that when executed they should bring the corresponding 
        // ! based on what We are looking for.
        const Search = await GoogleInstance.Search();

        // ! We show the result of the search in the terminal.
        console.log(Search);
    }catch(SearchRuntimeError){
        // ! If an error occurs, which would usually be an 
        // ! HTTP 429, it will be displayed in the terminal as well.
        console.log(SearchRuntimeError);
    }
}());
```
### Example of the autocomplete using the specific engine
```javascript
// ! Requiring the suggestion engine
const SuggestEngine = require('cdrake-se/Engines/Suggest');

// ! Creating an asynchronous function that will be executed 
// ! automatically when the script is initialized, which will 
// ! search for information and display it on the screen
(async function(){
    // ! Creating a constant that stores an array with the possible 
    // ! results that the autocompletion may have the query that we send 
    // ! as a parameter to the function of the engine that we have imported
    const Suggests = await SuggestEngine('How to');
    
    // ! We show in the terminal the possible autocompletions that the Query 
    // ! that we have requested in this case 'How to' can have
    console.log(Suggests);
}());
```
### Others examples
##### Getting news
In this example we will obtain news that is related to Covid 19, we will use the automatic search.
```javascript
// ! Importing the library to perform the search
const SearchEngine = require('cdrake-se');

// ! Creating an asynchronous function that will be executed 
// ! automatically when the script is initialized, which will 
// ! search for information and display it on the screen
(async function(){
    try{
        // ! Creating a variable that will store the array with objects 
        // ! that will contain the search for news related to covid 19
        const Covid19News = await SearchEngine({
            // ! We indicate the method, in this case News
            Method: 'News',
            // ! We indicate the page
            Page: 1,
            // ! We indicate the query, in this case Covid 19 to return us news related to covid
            Query: 'Covid 19',
            // ! We indicate the language
            Language: 'en-US'
        });

        // ! Finally we show the news in the terminal
        console.log(Covid19News);
    }catch(SearchRuntimeError){
        // ! If an error occurs, we will display it in the terminal
        console.log(SearchRuntimeError);
    }
}());
```
##### Using two search engines to get links
We will not mix the results, although we can do it, what we will do is use two search engines to solve a request, the first one to return an answer is the one that will be shown to the client, it is what the automatic search does but we will do it manually.
```javascript
// ! We import the two engines that we will use to perform the search
const GoogleEngine = require('cdrake-se/Engines/Google');
const YahooEngine = require('cdrake-se/Engines/Yahoo');

// ! Creating an asynchronous function that will be executed 
// ! automatically when the script is initialized, which will 
// ! search for information and display it on the screen
(async function(){
    try{
        // ! We create an object that will contain the data to 
        // ! instantiate the engine, we create an object and assign it 
        // ! to a variable so as not to write the same data twice, both engines 
        // ! must be instantiated with the same object because we want to obtain 
        // ! the same results from one of them. the two motors, the one that responds faster.
        const Search = {
            Query: 'Elon Musk',
            Page: 1,
            Language: 'en-US'
        };

        // ! We create both instances and pass them the object that contains 
        // ! the data of the request to resolve.
        const GoogleInstance = new GoogleEngine(Search);
        const YahooInstance = new YahooEngine(Search);

        // ! We create a constant that will store the response, using Promise.any 
        // ! we pass an array, what Promise.any will do is through the array of 
        // ! promises it receives, return the one that is resolved first, ignoring 
        // ! the errors that may arise inside, that way , if Google responds first 
        // ! but returns a 429 it will go to Yahoo.
        // ! In this way we will be avoiding the 429 and returning the same results.
        const Response = await Promise.any([
            GoogleInstance.Search(), 
            YahooInstance.Search() 
        ]);

        // ! Finally we show the results in the terminal.
        console.log(Response); 
    }catch(SearchRuntimeError){
        // ! If an error occurs, we will display it in the terminal.
        console.log(SearchRuntimeError);
    }
}());
```
##### Getting books
In this example, we will obtain books related to the universe, a curious fact, codexdrake, our creation, is called that due to codex 'greed' from the Latin and drake that I gave the meaning of results, since it is an equation that allows finding possible alien civilizations, haha.
```javascript
// ! We import the search engine to perform the request
const SearchEngine = require('cdrake-se');

// ! Creating an asynchronous function that will be executed 
// ! automatically when the script is initialized, which will 
// ! search for information and display it on the screen
(async function(){
    try{
        // ! Creating a variable that will store the search 
        // ! results, the array with objects.
        const Books = await SearchEngine({
            // ! We indicate our query, in this case 'Universe', since we 
            // ! want to search for books related to the universe.
            Query: 'Universe',
            // ! What page are we requesting?
            Page: 1,
            // ! We indicate that we want to search for books.
            Method: 'Books',
            // ! We indicate the language
            Language: 'en-US'
        });
        
        // ! We show related books in the terminal
        console.log(Books);
    }catch(SearchRuntimeError){
        // ! If an error occurs, it will be displayed in the terminal
        console.log(SearchRuntimeError);
    }
}());
```
##### Fetching videos
In this example we will get videos of kittens, if you are a bit shady you may not want to search for videos of kittens and maybe pepa pig sex, although you can do it, curiously this is safe and nobody will know that you searched for that, except your internet provider who is seeing the outgoing internet requests from your computer where you see the query 'pepa pig porn', well, you can burn their house down.
```javascript
// ! We import the search engine to perform the request
const SearchEngine = require('cdrake-se');

// ! Creating an asynchronous function that will be executed 
// ! automatically when the script is initialized, which will 
// ! search for information and display it on the screen
(async function(){
    try{
        // ! Creating a variable that will store the search 
        // ! results, the array with objects.
        const Videos = await SearchEngine({
            Query: 'Pretty kittens',
            Page: 1,
            Language: 'en-US',
            Method: 'Videos'
        });

        // ! We show in the terminal
        console.log(Videos);    
    }catch(SearchRuntimeError){
        // ! If an error occurs, it will be displayed in the terminal
        console.log(SearchRuntimeError);
    }
}());
```
##### Looking for items to buy
In this example we will look for items to buy, it is likely that the reader is embarrassed that his supplier sees him buying pills to make his cock erect, or that the reader is looking for 3cm condoms, but don't worry, there is rodi and here I have your solution, we will not look for any of the above, but it is something to modify.
```javascript
// ! We import the search engine to perform the request
const SearchEngine = require('cdrake-se');

// ! Creating an asynchronous function that will be executed 
// ! automatically when the script is initialized, which will 
// ! search for information and display it on the screen
(async function(){
    try{
        // ! Creating a variable that will store the search 
        // ! results, the array with objects.
        const Articles = await SearchEngine({
            Query: 'Smartphone',
            Page: 1,
            Language: 'en-US',
            Method: 'Shopping'
        });

        // ! We show in the terminal
        console.log(Articles);
    }catch(SearchRuntimeError){
        // ! If an error occurs, it will be displayed in the terminal
        console.log(SearchRuntimeError);
    }
}());
```
##### Looking for images
It is possible that the reader is a hunk, but a fake hunk, who is wanted by the FBI, who uses image search engines to look for fake photos and tell girls that it is him, don't worry, friend, here you go your safe search engine, we will not look for photos of muscular masculine men, but we will look for images of pepa pig.
```javascript
// ! We import the search engine to perform the request
const SearchEngine = require('cdrake-se');

// ! Creating an asynchronous function that will be executed 
// ! automatically when the script is initialized, which will 
// ! search for information and display it on the screen
(async function(){
    try{
        // ! Creating a variable that will store the search 
        // ! results, the array with objects.
        const Images = await SearchEngine({
            Query: 'Pepa pig',
            Page: 1,
            Language: 'en-US',
            Method: 'Images'
        });

        // ! We show in the terminal
        console.log(Images);
    }catch(SearchRuntimeError){
        // ! If an error occurs, it will be displayed in the terminal
        console.log(SearchRuntimeError);
    }
}());
```

##### Gathering information from a Wikipedia page or biography
You can collect a lot of information by requesting a search of the Wikipedia databases, if this search exactly matches one it will return a ton of information that is organized inside an object, in case, there is no page in based on your search a { Status: 'Error' } will be returned.

```javascript
// ! Importing the library to perform the search
const SearchEngine = require('cdrake-se');

// ! Creating an asynchronous function that will be executed 
// ! automatically when the script is initialized, which will 
// ! search for information and display it on the screen
(async function(){
    try{
        const LinusTorvaldsWikipediaPage = await SearchEngine({
            // ! We indicate the method, in this case Wikipedia <SEARCH>
            Method: 'Wikipedia',
            // ! We indicate the query, in this case Linus Torvalds to return us information related to Linus Torvalds
            Query: 'Linus Torvalds',
            // ! We indicate the language
            Language: 'en'
        });
        console.log(LinusTorvaldsWikipediaPage);
    }catch(SearchRuntimeError){
        // ! If an error occurs, we will display it in the terminal
        console.log(SearchRuntimeError);
    }
}());
```

##### Using the Wikipedia suggestion engine.
Apart from the search suggestion that the engine has, you can use the suggestion engine that Wikipedia has, so that you can obtain existing links within their respective databases to access them.

```javascript
// ! Importing the library to perform the search
const SearchEngine = require('cdrake-se');

// ! Creating an asynchronous function that will be executed 
// ! automatically when the script is initialized, which will 
// ! search for information and display it on the screen
(async function(){
    try{
        const ElonWikipediaSearchSuggests = await SearchEngine({
            // ! We indicate the method, in this case Wikipedia Suggestion
            Method: 'Wikipedia.Suggest',
            // ! We indicate the query, in this case Elon to return us suggestions
            Query: 'Elon',
            // ! We indicate the language
            Language: 'en'
        });
        console.log(ElonWikipediaSearchSuggests);
    }catch(SearchRuntimeError){
        // ! If an error occurs, we will display it in the terminal
        console.log(SearchRuntimeError);
    }
}());
```

### Contributions and future versions
This library along with its real world usage example web service will continue to receive updates, improvements and bug fixes, I decided to make the engine that uses the codexdrake library search web service so that other developers can experiment with it, create better stuff and update them if they fucking want to, they can do whatever they want with the code.