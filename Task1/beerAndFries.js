function calcScore(sortedBeers, sortedFries) {
        var i,
                beersAmount = sortedBeers.length,
                friesAmount = sortedFries.length,
                length = beersAmount < friesAmount ? beersAmount : friesAmount,
                result = 0;
        for(i = 0; i < length; i++) {
                result += sortedBeers[i].score * sortedFries[i].score;
        }
        if(length < beersAmount) {
                for(i; i < beersAmount; i++) {
                        result += sortedBeers[i].score;
                }
        } else {
                for(i; i < friesAmount; i++) {
                        result += sortedFries[i].score;
                }
        }
        return result;
}
 
exports.beerAndFries = function beerAndFries(items) {
        var beerContainer = items.filter(function(item){if(item){return item.type === 'beer';}}),
                friesContainer = items.filter(function(item){if(item){return item.type === 'fries';}});
       
        beerContainer.sort(function(firstItem, secondItem){ return secondItem.score - firstItem.score;});
       
        friesContainer.sort(function(firstItem, secondItem){ return secondItem.score - firstItem.score;});
       
        return calcScore(beerContainer, friesContainer);
}