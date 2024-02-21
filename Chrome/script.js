var li_at = ''
var host = 'http://localhost/'
var checking_feed_page_false = { 'checking_feed_page': false };
var checking_feed_page_true = { 'checking_feed_page': true };

function saveData(key, data) {
    const storageData = {};
    storageData[key] = data;

    chrome.storage.local.set(storageData, function () {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
        } else {
            console.log('Data saved successfully');
        }
    });
}


// Retrieve JSON data using a specific key name
function getData(key, callback) {
    chrome.storage.local.get(key, function (result) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            callback(null);
        } else {
            callback(result[key]);
        }
    });
}


async function getCookies(domain, name, callback) {
    chrome.cookies.get({ "url": domain, "name": name }, function (cookie) {
        if (callback) {
            try {
                callback(cookie.value);
            } catch (err) {
                li_at = ''
            }

        }
    });
}

function checkAndExecute(targetUrl) {
    function checkAndUpdate(tab) {
        getData('checking_feed_page', function (data) {
            if (data.checking_feed_page === true) {

                element = document.getElementById("loading-icon")

                if (element.style.display === 'none') {
                    element.style.display = 'flex'
                }
                
                if (tab.url === targetUrl) {
                    saveData('checking_feed_page', checking_feed_page_false);
                    connect();
                    element.style.display = 'none';
                }
            }

        });
    }

    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (changeInfo.url && tab.active && tab.url) {
            checkAndUpdate(tab);
        }
    });

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs && tabs.length > 0) {
            var currentTab = tabs[0];
            checkAndUpdate(currentTab);
        }
    });

    var checkUrlInterval = setInterval(function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

            if (tabs && tabs.length > 0) {
                var currentTab = tabs[0];
                checkAndUpdate(currentTab);
            }

        });
    }, 1000);
}


getCookies("https://www.linkedin.com/", "li_at", function (value) {
    li_at = value
});

document.getElementById("connect").addEventListener("click", connect);

checkAndExecute("https://www.linkedin.com/feed/")

function openLink(link) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var tab = tabs[0];
        if (li_at == '') {
            chrome.tabs.update(tab.id, { url: "https://www.linkedin.com/login" });
            saveData('checking_feed_page', checking_feed_page_true);
        } else {
            chrome.tabs.update(tab.id, { url: link });
        }

    });
}


function connect() {
    var link = host + 'loading_bridge?to=update_linkedin_access?li_at=' + li_at;
    openLink(link);
}