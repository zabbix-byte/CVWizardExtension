var li_at = ''
var host = 'http://localhost/'

async function getCookies(domain, name, callback) {
    chrome.cookies.get({ "url": domain, "name": name }, function (cookie) {
        if (callback) {
            callback(cookie.value);
        }
    });
}

getCookies("https://www.linkedin.com/", "li_at", function (value) {
    li_at = value
});

document.getElementById("connect").addEventListener("click", connect);


function openLink(link) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var tab = tabs[0];
        chrome.tabs.update(tab.id, { url: link });
    });
}


function connect() {
    var link = host + 'update_linkedin_access?li_at=' + li_at;
    openLink(link);
}