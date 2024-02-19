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

function connect() {

    var link = host + 'update_linkedin_access?li_at=' + li_at;
    chrome.tabs.create({ url: link });
}