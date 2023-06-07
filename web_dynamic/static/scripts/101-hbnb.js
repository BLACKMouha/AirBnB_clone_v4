#!/usr/bin/node
function getAlphaMonth(month) {
  monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  return monthNames[month];
}

function getOrdinaryDay (day) {
  let suffix = 'th';
  if (day === 1 || day === 21 || day === 31)
    suffix = 'st';
  else if (day === 2 || day === 22)
    suffix = 'nd';
  else if (day === 3 || day === 23)
    suffix = 'rd';
  return (String(day) + suffix);
}

function getPlainTextDate(date) {
  let s = `the ${getOrdinaryDay(date.getDay())} `;
  s += `${getAlphaMonth(date.getMonth())} ${date.getFullYear()}`
  return (s);
}

$( document ).ready(function () {
  let amenity_ids = [];
  let amenities = {};
  $('.amenities .popover ul').on('click', function (e) {
    const target = $(e.target);
    if (target.is('li input[type="checkbox"]')) {
      const id = target.attr("data-id");
      const i = amenity_ids.indexOf(id);
      if (target.is(':checked')) {
        if (i === -1) {
          amenity_ids.push(target.attr('data-id'));
          amenities[id] = target.attr('data-name');
        }
      }
      else {
        if (i !== -1) {
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
  });

  let state_ids = [];
  let city_ids = [];
  let states = {};
  let cities = {};
  $('.locations .popover ul').on('click', function (e) {
    const target = $(e.target);
    if (target.is('.scb')) {
      const id = target.attr("data-id");
      const i = state_ids.indexOf(id);
      console.log(id);
      if (target.is(':checked')) {
        if (i === -1) {
          state_ids.push(target.attr('data-id'));
          states[id] = target.attr('data-name');
        }
      }
      else {
        if (i !== -1) {
          state_ids.splice(i, 1);
          delete states[id];
        }
      }
    }
    else if (target.is('.ccb')) {
      const id = target.attr("data-id");
      const i = city_ids.indexOf(id);
      console.log(id);
      if (target.is(':checked')) {
        if (i === -1) {
          city_ids.push(target.attr('data-id'));
          cities[id] = target.attr('data-name');
        }
      }
      else {
        if (i !== -1) {
          city_ids.splice(i, 1);
          delete cities[id];
        }
      }
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
        <article data-id="${place.id}>
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
  $('section.places article').html (function () {
    let node = '';
    node += ``;
  });

  $('button').click(function () {
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      contentType: 'application/json',
      data: JSON.stringify({"amenities": amenity_ids, "cities": city_ids, "states": state_ids}),
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
          <div class="description">${place.description}</div>`;
          node += `
          <div class="reviews">
            <h2>`;
          $.getJSON(`http://0.0.0.0:5001/api/v1/places/${place.id}/reviews`, function (reviews) {
            node += `${reviews.length} Reviews`;
            if (reviews.length > 1)
              node += 's';
            node += `</h2>
              <ul>`;
            $.each(reviews, function (index, review) {
              node += `<li>
                  <h3>From `;
              $.getJSON(`http://0.0.0.0:5001/api/v1/users/${reviews.user_id}`, function (user) {
                node += `${user.first_name} ${user.last_name}`;
              });
              node += `${getPlainTextDate(new Date(review.updated_at)}</h3>
                <p>${review.text}</p>
                </li>`;
            });
            node += `</ul>
                  </div>
                  `;
          });
          node +=`
          </article>
          `;
        });
        $('section.places').html(node);
      }
    });
  });
});
