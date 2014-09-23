(function () {
    'use strict';
    exports.beerAndFries = function beerAndFries(items) {
        var items = items.sort(function (firstItem, secondItem) {
                return secondItem.score - firstItem.score;
            }),
            beerContainer = items.filter(function (item) {
                return item.type === 'beer';
            }),
            friesContainer = items.filter(function (item) {
                return item.type === 'fries';
            });
        return beerContainer.reduce(function (previousValue, currentValue, index, array) {
            return previousValue + currentValue.score * friesContainer[index].score;
        }, 0);
    }
})();
