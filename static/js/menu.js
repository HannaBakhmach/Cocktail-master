var MenuItem = function (id, name, price, recipe, available) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.recipe = new Recipe(recipe);
    this.available = available;
};

MenuItem.prototype.html = function () {
    var result = $('<li></li>')
        .val(this.id)
        .html([
            $('<p></p>').addClass('cocktailName').html(this.name),
            $('<p></p>').addClass('cocktailPrice').html(this.price + 'грн'),
            $('<p></p>').addClass('cocktailRecipe').html(this.recipe.format()).addClass('text-center')
        ]);
    (this.available) ? result.addClass('available') : result.addClass('unavailable');
    return result;
};

var StorageItem = function (name, quantity) {
    this.name = name;
    this.quantity = quantity;
};
var Recipe = function (items) {
    this.items = [];
    var scope = this;
    $.each(items, function (index, item) {
        scope.items.push(new StorageItem(index, item));
    })
};

Recipe.prototype.format = function () {
    var res = '';
    $.each(this.items, function (index, item) {
        res += item.name + ' ' + item.quantity + 'мл;';
    });
    return res;
};

var Storage = function (url, update_now) {
    this.items = [];
    this.url = url;
    if (update_now) this.update();
};

Storage.prototype.update = function () {
    var scope = this;
    ajaxGet(scope.url, function (result) {
        scope.items = [];
        $.each(result, function (index, item) {
            scope.items.push(new StorageItem(index, item));
        });
    });
};

Storage.prototype.get_quantity = function (name) {
    var res;
    $.each(this.items, function (index, value) {
        if (name == value.name)
            res = value.quantity;
    });
    return res;
};


var Menu = function (selector) {
    this.selector = $(selector);
    this.items = [];
};

Menu.prototype.add = function (id, name, price, recipe, available) {
    this.items.push(new MenuItem(id, name, price, recipe, available));
};

Menu.prototype.render = function () {
    this.selector.html($.map(this.items, function (item) {
        return item.html();
    }));
};

Menu.prototype.get = function (id) {
    for (var index in this.items) {
        if (this.items[index].id == id) return this.items[index];
    }
};

Menu.prototype.update = function (storage) {
    var scope = this;
    var availability;
    var storage_quantity;
    if (typeof storage === 'undefined')
        storage = window.storage;
    storage.update();
    $(document).ajaxStop(function () {
        $.each(scope.items, function (index, menuItem) {
                availability = true;
                if (!(menuItem.recipe.items.length == 0)) {
                    for (var index in menuItem.recipe.items) {
                        ingredient = menuItem.recipe.items[index];
                        storage_quantity = storage.get_quantity(ingredient.name);
                        if (storage_quantity <= 0)
                            availability = false;
                        if (storage_quantity < ingredient.quantity)
                            availability = false;
                    }
                }
                else
                    availability = false;
                menuItem.available = availability;
            }
        );
        scope.render();
    });
    $(document).ajaxStop(function () {
    });
};