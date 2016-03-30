var menu = new Menu('.menu');
var storage = new Storage('/ajax/storage');
var orders = new Orders('.orders');

$(document).ready(function () {
    $.when(
        ajaxGet('/ajax/cocktails', function (cocktails) {
            $.each(cocktails, function (index, item) {
                menu.add(item['id'], index, item['price'], item['recipe']);
            });
            menu.update(storage);
        })
    ).done(function () {
        $('ul.menu')
            .attr('unselectable', 'on')
            .css('user-select', 'none')
            .on('selectstart', false)
            .on('click', 'li', function (e) {
                var id = $(this)[0].value;
                var item = menu.get(id);
                if (item.available) {
                    orders.add(menu.get(id));
                    ajaxPost('/ajax/order', {'id': id}, function () {
                    });
                    menu.update();
                }
            });
        $('ul.orders').on('click', 'button.done', function (e) {
            orders.deleteIndex($(this)[0].value);
            console.log($(this));
        });
    });

    /*$('ul.orders')
     .attr('unselectable', 'on')
     .css('user-select', 'none')
     .on('selectstart', false)
     .on('click', 'li', function (e) {
     orders.delete(menu.get($(this)[0].value));
     });*/

});


