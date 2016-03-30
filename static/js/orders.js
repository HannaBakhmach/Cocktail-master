var Orders = function (selector) {
    this.items = [];
    this.selector = $(selector);
};

Orders.prototype.add = function (item) {
    //if(this.items.indexOf(item) == -1)
        this.items.push(item);
    this.render();
};

Orders.prototype.delete = function (item) {
    this.items.splice(this.items.indexOf(item), 1);
    this.render();
};

Orders.prototype.deleteIndex = function(index){
    this.items.splice(index-1, 1);
    this.render();
};

Orders.prototype.renderItem = function (item, index) {
    var result = $('<li></li>')
        .val(index)
        .html([
            $('<p></p>').addClass('cocktailName').html(item.name),
            $('<p></p>').addClass('cocktailPrice').html([item.price + 'грн', $('<button></button>').val(index).html('выполнено').addClass('done')]),
            $('<p></p>').addClass('cocktailRecipe').html(item.recipe.format()).addClass('text-center')
        ]);
    (item.available) ? result.addClass('available') : result.addClass('unavailable');
    return result;
};

Orders.prototype.render = function() {
    var scope = this;
    var index = 0;
    this.selector.html($.map(this.items, function (item) {
        index++;
        return scope.renderItem(item, index);
    }));
};