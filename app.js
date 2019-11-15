var list = '';
const loopBookmarkFolders = (obj) => {
    obj.forEach(item => {
        splitBookmarks(item);
    });
};

const splitBookmarks = (item) => {
    if (item.title && !item.children && item.url) {
        list += `
            <div class="item">
                <div class="item-text" data-url="${item.url}">${item.title}</div>
                <button class="delete" data-id="${item.id}">Delete</button>
            </div>
        `;
    }

    if (item.children && item.children.length > 0) {
        list += (item.title) ? `<div class="folder-title">${item.title.toUpperCase()}</div><hr>` : '';

        loopBookmarkFolders(item.children);
    } else {
        // loop finished
        document.querySelector('#bookmark-wrap').innerHTML = list;
        addOpenLinkEvent();
        addDeleteEvent();
    }
}

function getBookmarks() {
    chrome.bookmarks.getTree(
        (source) => {
            try {
                loopBookmarkFolders(source);
            } catch (e) {
                print(e);
            }
        });
}

function addDeleteEvent() {
    document.querySelectorAll('.delete').forEach(btns => {
        btns.addEventListener('click', () => {
            deleteBookmark(btns.getAttribute("data-id"), btns);
        });
    });
}

function addOpenLinkEvent() {
    document.querySelectorAll('.item-text').forEach(item => {
        item.addEventListener('click', () => {
            try {
                chrome.windows.getCurrent(function(w) {
                    chrome.tabs.create({ "url": item.getAttribute("data-url")});
                });
            } catch (e) {
                print(e);
            }
        });
    });
}

function deleteBookmark(id, el) {
    chrome.bookmarks.remove(String(id));
    el.parentNode.remove();

}

document.addEventListener('DOMContentLoaded', () => {
    getBookmarks();
});


// debugging
function print() {
    var args = Array.prototype.slice.call(arguments, 0);
    document.getElementById('output').innerHTML += args.join(" ") + "\n";
}