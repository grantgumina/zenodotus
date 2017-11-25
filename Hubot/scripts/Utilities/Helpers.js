class Helpers {
    constructor() {

    }

    extract(regex, text) {
        // found on stackoverflow
        var foundItems = text.match(regex);
        foundItems = foundItems ? foundItems : [];
        
        foundItems.forEach(function(item, index) {
            foundItems[index] = item.trim();
        });
        
        return foundItems;
    }
    
    extractLinks(messageText) {
        let urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
        // "(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))" ,
        return this.extract(urlRegex, messageText);
    }
    
    extractTags(messageText) {
        let tagRegex = /%([^\s][^0-9][a-z]*)/g;
        return this.extract(tagRegex, messageText);
    }
}

module.exports = new Helpers();