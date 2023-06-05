#!/usr/bin/node
$( document ).ready(function () {
  let amenities = [];
  $('.amenities .popover ul').on('click', function (e) {
      const target = $(e.target);
      if (target.is('li input[type="checkbox"]')) {
          const id = amenities.indexOf(target.attr('data-name'));
          if (target.is(':checked')) {
              if (id == -1)
                  amenities.push(target.attr('data-name'));
          }
          else {
              if (id != -1)
                  amenities = amenities.filter(function (el) {
                      return target.attr('data-name') !== el
                  });
          }
      }
      if (amenities === [])
        $('.amenities h4').text('&nbsp;');
      else {
        h4Content = amenities.join(', ');
        if (h4Content.length > 25)
              h4Content = h4Content.substring(0, 25) + '...';
        $('.amenities h4').text(h4Content);
      }
  });
});
