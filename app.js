var list = '<div>';
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
        list += (item.title) ? `</div><div class="folder-title collapsible">${item.title.toUpperCase()}</div><div class="content">` : '';

        loopBookmarkFolders(item.children);
    } else {
        // loop finished
        document.querySelector('#bookmark-wrap').innerHTML = list;
        addOpenLinkEvent();
        addDeleteEvent();
        addCollapsible();
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

function addCollapsible() {
    let topic = document.querySelectorAll('.collapsible');
    Array.from(topic).forEach(eachTopic => {
        eachTopic.addEventListener('click', function(event) {
            eachTopic.classList.toggle("active");
            let content = eachTopic.nextElementSibling;
            if (content.style.maxHeight){
              content.style.maxHeight = null;
            } else {
              content.style.maxHeight = content.scrollHeight + "px";
            } 
        });

        let bookmarkCategory = eachTopic.innerHTML;
        if(bookmarkCategory == 'BOOKMARKS BAR' || bookmarkCategory == 'MOST USED') {
            if (!eachTopic.classList.contains("active")) {
                eachTopic.classList.toggle("active");
                if (eachTopic.nextElementSibling.style.maxHeight){
                    eachTopic.nextElementSibling.style.maxHeight = null;
                } else {
                    eachTopic.nextElementSibling.style.maxHeight = eachTopic.nextElementSibling.scrollHeight +10 + "px";
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    getBookmarks();
});


// debugging
function print() {
    var args = Array.prototype.slice.call(arguments, 0);
    document.getElementById('output').innerHTML += args.join(" ") + "\n";
}