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


  $.getJSON('http://0.0.0.0:5001/api/v1/status/', function (d) {
    if (d.status === 'OK')
      $('#api_status').addClass('available');
    else
      $('#api_status').removeClass('available');
  });

  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    contentType: 'application/json',
    data: '{}',
    success: function (data) {
      let node = '';
      $.each(data, function (index, place) {
        node += `
        <article>
          <div class="title_box">
            <h2>${place.name}</h2>
            <div class="price_by_night">$${place.price_by_night}</div>
          </div>
          <div class="information">
            <div class="max_guest">${place.max_guest} Guest`;
        if (place.max_guest > 1)
          node += 's';
        node += `</div>
            <div class="number_rooms">${place.number_rooms} Bedroom`;
        if (place.number_rooms > 1)
          node += 's';
        node += `</div>
            <div class="number_bathrooms">${place.number_bathrooms} Bathroom`;
        if (place.number_bathrooms > 1)
          node += 's';
        node += `</div>
          </div>
          <div class="user">`;
        node += `</div>
          <div class="description">${place.description}</div>
        </article>
        `;
      });
      $('section.places').html(node);
    }
  });
});
