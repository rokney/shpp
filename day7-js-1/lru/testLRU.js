/**
 * Created by rokne on 11.01.2016.
 */
var assert = require('assert');
var lru = require('./lru').LRUCache;

var newCache = new lru(4);

newCache.put('adam', 15);
newCache.put('peter', 23);
newCache.put('john', 43);
newCache.put('sam', 12);

assert.equal(newCache.toString(), 'adam:15 <- peter:23 <- john:43 <- sam:12');

newCache.get('john');
console.log(newCache.get('john'));
assert.equal(newCache.toString(), 'adam:15 <- peter:23 <- sam:12 <- john:43');

newCache.put('alex', 12);
assert.equal(newCache.toString(), 'peter:23 <- sam:12 <- john:43 <- alex:12');
assert.equal(newCache.get('adam'), undefined);