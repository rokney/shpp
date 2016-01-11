if (typeof this === "object") {
    this.LRUCache = LRUCache;
}

function LRUCache(limit) {
    this.size = 0;
    this.limit = limit;
    this.list = {};
}

LRUCache.prototype = {
    put: function (key, value) {
        var inputData = {key: key, value: value};
        this.list[key] = inputData;
        if (this.tail) {
            this.tail.next = inputData;
            inputData.prev = this.tail;
        } else {
            this.head = inputData;
        }

        this.tail = inputData;
        if (this.size === this.limit) {
            return this.correctList();
        } else {
            this.size++;
        }
    },
    correctList: function () {
        var currItem = this.head;
        if (currItem) {
            if (this.head.next) {
                this.head = this.head.next;
                this.head.prev = undefined;
            } else {
                this.head = undefined;
            }
            currItem.next = currItem.prev = undefined;
            delete this.list[currItem.key];
        }
        return currItem;
    },
    get: function (key) {
        var currItem = this.list[key];
        if (currItem === undefined) {
            return;
        }
        if (currItem === this.tail) {
            return currItem.value;
        }

        if (currItem.next) {
            if (currItem === this.head) {
                this.head = currItem.next;
            }
            currItem.next.prev = currItem.prev;
        }
        if (currItem.prev) {
            currItem.prev.next = currItem.next;
        }
        currItem.next = undefined;
        currItem.prev = this.tail;
        if (this.tail) {
            this.tail.next = currItem;
        }
        this.tail = currItem;
        return currItem.value;
    },
    toString: function () {
        var result = '';
        var currItem = this.head;
        while (currItem) {
            result += String(currItem.key) + ':' + currItem.value;
            currItem = currItem.next;
            if (currItem) {
                result += ' <- ';
            }
        }
        return result;
    }
}