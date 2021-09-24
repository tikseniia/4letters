$(window).on('load', function() {
  var time = $('.runner').width() * 4;
  $('.runner-body').animate({scrollLeft: $('.runner').width()}, time, 'linear');
  $('.runner-body').animate({scrollLeft: 0}, .3*time, 'linear');
  setInterval(function(){
    $('.runner-body').animate({scrollLeft: $('.runner').width()}, time, 'linear');
    $('.runner-body').animate({scrollLeft: 0}, .3*time, 'linear');
  }, time*1.4);
})

$('.change-color').click(function() {
  var color = $(this).attr('data-color');
  $('.change-color').removeClass('change-color-active');
  $(this).addClass('change-color-active');
  $('.pixel-active').each(function() {
    $(this).removeClass('purple');
    $(this).removeClass('red');
    $(this).removeClass('green');
    $(this).removeClass('blue');
    $(this).removeClass('yellow');

    $(this).addClass(color);
  })

  var v = '/runner/create-msg/?msg='+$('input').val()+'&color='+color;
  $('#createMsg').attr('href', v);
})
