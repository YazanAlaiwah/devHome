let data;
$(function () {
  data = $('#serverJobs').text();
  data = JSON.parse(data);
  // console.log(data)
  btns = data.length / 20 + (data.length % 20 > 0 ? 1 : 0);
  btns = Math.floor(btns);
  for (let i = 0; i < btns; i++) {
    var template = document.getElementById('btn').innerHTML;
    var rendered = Mustache.render(template, {
      index: i,
      number: i + 1,
    });
    $(rendered).appendTo('.containrbtn');
  }
  for (let i = 0; i < 20; i++) {
    var template = document.getElementById('job').innerHTML;
    var rendered = Mustache.render(template, {
      company_logo: data[i].company_logo,
      type: data[i].type,
      company: data[i].company,
      company_url: data[i].company_url,
      location: data[i].location,
      title: data[i].title,
      indx: i,
      number: i + 1,
      // description:data[i].description
    });
    var template2 = document.getElementById('popup').innerHTML;
    var rendered2 = Mustache.render(template2, {
      description: data[i].description,
      i,
    });
    $(rendered2).appendTo('body');
    $(rendered).appendTo('#sec2');
  }
  $('.popup').hide();
  hide(0);
  addForm();
});

function show(indx) {
  console.log(indx);
  $('.popup').hide();
  $(`.${indx}`).show();
}
function hide(i) {
  console.log(i);
  let end = i + 20;
  for (; i < end; i++) {
    $(`#detSec${i}`).hide();
  }
}

function addForm() {
  $('form[name="addjob"]').each(function (i, e) {
    $(this).submit(function (event) {
      // console.log(event.target.description.value);
      $.ajax({
        url: '/jobs/save/' + localStorage.id,
        data: {
          type: event.target.type.value,
          company_logo: event.target.company_logo.value,
          company: event.target.company.value,
          company_url: event.target.company_url.value,
          location: event.target.location.value,
          title: event.target.title.value,
          description: JSON.stringify(event.target.description.value),
        },
        type: 'POST',
        headers: { authorization: `bearer ${localStorage.token}` },
        success: function (data) {
          if (data === 'not the same user') {
            alert('not the same user');
          } else if (data === 'please login or singup') {
            alert('login please');
          } else {
            alert('done');
          }
        },
        error: function (err) {
          console.log(err);
        },
      });
    });
  });
}
function chengeJobs(i) {
  $('#sec2').empty();
  if (i < 100) {
    i *= 20;
  } else {
    i += 20;
  }
  let end = i + 20;
  for (; i < end; i++) {
    if (data[i] === undefined) {
      break;
    } else {
      var template = document.getElementById('job').innerHTML;
      var rendered = Mustache.render(template, {
        company_logo: data[i].company_logo,
        type: data[i].type,
        company: data[i].company,
        company_url: data[i].company_url,
        location: data[i].location,
        title: data[i].title,
        indx: i,
        number: i + 1,
      });
      var template2 = document.getElementById('popup').innerHTML;
      var rendered2 = Mustache.render(template2, {
        description: data[i].description,
        i,
      });
      // console.log(rendered2)
      $(rendered2).appendTo('body');
      $(rendered).appendTo('#sec2');
    }
  }
  $('.popup').hide();
  hide(i - 20);
  addForm();
  window.scrollTo(0, 0);
}

$('#searchjob').submit(function (event) {
  $.get(
    `/jobs?description=${event.target.description.value}&type=${event.target.type.value}&location=${event.target.location.value}`
  ).then((resulte) => {
    data = resulte;
    btns = data.length / 20 + (data.length % 20 > 0 ? 1 : 0);
    btns = Math.floor(btns);
    $('.containrbtn').empty();

    for (let i = 0; i < btns; i++) {
      var template = document.getElementById('btn').innerHTML;
      var rendered = Mustache.render(template, {
        index: i,
        number: i + 1,
      });
      $(rendered).appendTo('.containrbtn');
    }
    chengeJobs(0);
  });
});

function savedjobs() {
  $.ajax({
    type: 'GET',
    headers: {
      Authorization: `bearer ${localStorage.token}`,
    },
    url: '/jobs/user/' + localStorage.id,
    success: function (msg) {
      if (msg === 'not the same user') {
        alert(msg);
      } else if (msg === 'please login or singup') {
        alert(msg);
      } else {
        data = msg.rows;
        chengeJobs(0);
        btns = data.length / 20 + (data.length % 20 > 0 ? 1 : 0);
        btns = Math.floor(btns);
        $('.containrbtn').empty();
        for (let i = 0; i < btns; i++) {
          var template = document.getElementById('btn').innerHTML;
          var rendered = Mustache.render(template, {
            index: i,
            number: i + 1,
          });
          $(rendered).appendTo('.containrbtn');
        }
        console.log(msg.rows);
      }
    },
  });
}

function remove(i) {
  $('.' + i).hide();
  console.log(i);
}

for(var i=0;i<10;i++){
  var str = $( `#jobDes${i}` ).text();
  $(`#jobDes${i}` ).html( str );  
}
