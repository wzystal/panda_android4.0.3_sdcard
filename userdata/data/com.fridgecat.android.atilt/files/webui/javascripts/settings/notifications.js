// DO NOT EDIT
//   Generated from javascripts/settings/notifications.coffee
//
(function() {
  OF.settings.read('notifications_enabled', function(notificationsEnabled) {
    if (notificationsEnabled) {
      return $('#notifications_enabled').addClass('on');
    } else {
      return $('#notifications_disabled').addClass('on');
    }
  });
  $('.radio_container').touch(function() {
    return $(this).parent('fieldset').find('.radio_button').toggleClass('on');
  });
  $('#submit').touch(function() {
    if ($('#notifications_enabled').hasClass('on')) {
      OF.action('registerPush');
      OF.settings.write('notifications_enabled', true);
    } else {
      OF.action('unregisterPush');
      OF.settings.write('notifications_enabled', false);
    }
    return OF.goBack();
  });
}).call(this);
