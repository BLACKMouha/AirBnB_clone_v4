#!/usr/bin/node
$( document ).ready(function () {
  let amenity_ids = [];
  let amenities = {};
  $('.amenities .popover ul').on('click', function (e) {
    const target = $(e.target);
    if (target.is('li input[type="checkbox"]')) {
      const id = target.attr("data-id");
      const i = amenity_ids.indexOf(id);
      if (target.is(':checked')) {
        if (i == -1) {
          amenity_ids.push(target.attr('data-id'));
          amenities[id] = target.attr('data-name');
        }
      }
      else {
        if (i != -1) {
          amenity_ids.splice(i, 1);
          delete amenities[id];
        }
      }
    }
    if (amenities === {})
      $('.amenities h4').text('&nbsp;');
    else {
      h4Content = Object.values(amenities).join(', ');
      if (h4Content.length > 25)
        h4Content = h4Content.substring(0, 25) + '...';
      $('.amenities h4').text(h4Content);
    }
    console.log(amenities);
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

  $('button').click(function () {
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      contentType: 'application/json',
      data: JSON.stringify({"amenities": amenity_ids}),
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
});
