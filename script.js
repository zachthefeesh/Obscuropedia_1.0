var url = "https://en.wikipedia.org/w/api.php?action=query&format=json"; 
const container = document.getElementById('container');  

//DESCRIBE PARAMS FOR RETREIVING TOP CATEGORY MEMBERS
var params = {
    list: "categorymembers",
    cmtitle: "Category:{category_name}",
    cmprop: "ids|title|type|extracts", // |timestamp
    cmtype: "page",
    cmlimit: "max",
    rawcontinue: "1&redirects",
};
//ADDS ALL PARAMS FROM THE PARAMS OBJECT TO THE URL STRING
Object.keys(params).forEach(function(key){
    url += "&" + key + "=" + params[key];
});
console.log(url)

//LIST OF CLASSIFICATIONS pulled from https://en.wikipedia.org/wiki/Category:Main_topic_classifications
const categories = [ 
    "Business",
    "Communication",
    "Culture",
    "Economy",
    "Education",
    "Energy",
    "Engineering",
    "Entertainment",
    "Ethics",
    "Food and drink",
    "Geography",
    "Government",
    "Health",
    "History",
    "Human behavior",
    "Humanities",
    "Information",
    "Internet",
    "Knowledge",
    "Language",
    "Law",
    "Life",
    "Mass media",
    "Mathematics",
    "Military",
    "Nature",
    "Philosophy",
    "Politics",
    "Religion",
    "Science",
    "Society",
    "Technology",
    "Time",
    "Universe",
    //Other possible categories include:
        // "Concepts",
        // "Sports",
]

const categoryMenu = document.getElementById("categories")
for(var i in categories){
    categoryMenu.innerHTML += `<option value="${categories[i]}">${categories[i]}</option>`
}

function getNewPage(categoryName){
    //FINDS CATEGORY BASED ON DROPDOWN MENU
    var tempUrl = url.replace('{category_name}', categoryName);

    console.log(tempUrl)
    fetch(tempUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data)

            // FIND ALL THE TOP PAGES OF SELECTED CATEGORY
            var pages = data.query.categorymembers;

            console.log(pages)
            // PICK A RANDOM ONE AND GENERATE ITS URL
            var randomPage = pages[Math.floor(Math.random() * pages.length)];
            var pageId = `${randomPage.pageid}`
            var newUrl = tempUrl+`&pageids=${pageId}&prop=extracts|pageimages&exsentences=2&explaintext=&pithumbsize=500`; 
                //exsentences = num sentences pulled from the page, 
                //explaintext = whether the text is returned in HTML or plain text, 
                //pitthumbsize = size of thumbnail image

            //GATHER INFORMATION FROM THE NEW URL
            fetch(newUrl)
                .then(response => response.json())
                .then(data => {
                    console.log(data.query.pages[pageId])
                    var page = data.query.pages[pageId]

                    //CHECK IF PAGETHUMBNAIL ATTRIBUTE EXISTS
                    if (page.thumbnail) {
                        //IF SO, MAKE IT THE DISPLAY IMAGE
                        imageUrl = page.thumbnail.source;
                    } else {
                        //IF NOT, SET DISPLAY IMAGE TO DEFAULT
                        imageUrl = 'images/default.jpg';
                    }

                    //UPDATE HTML ELEMENTS
                    document.getElementById("image").src = imageUrl;
                    document.getElementById("image").alt = page.title;
                    document.getElementById("title").innerText = page.title;
                    document.getElementById("description").innerText = page.extract;
                })
        })
}


//Select a çategory from the menu, then press the go button to see a random page from that category!
//When the go button is pressed, getNewPage is called
document.getElementById("goButton").addEventListener("click", () => {
    getNewPage(categoryMenu.value)}
)

// WIKIPEDIA DOCUMENTION & RESEARCH
// https://en.wikipedia.org/wiki/Wikipedia:Pageview_statistics#:~:text=Page%20view%20statistics%20(or%20Pageview,tests%2C%20it%20has%20some%20limitations.
// https://www.mediawiki.org/wiki/API:Lists
// https://www.mediawiki.org/wiki/API:Properties
// https://www.mediawiki.org/wiki/API:Images#JavaScript
// https://www.mediawiki.org/wiki/API:Querypage
// https://www.mediawiki.org/wiki/API:Parsing_wikitext
// https://www.mediawiki.org/wiki/Manual:Random_page
