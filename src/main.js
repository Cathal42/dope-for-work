import 'amfe-flexible';
import Vue from 'vue';
import App from './App';
import { router } from './router';

Vue.filter('formatDate', function(val) {
  let value = new Date(val),
      year = value.getFullYear(),
      month = padDate(value.getMonth() + 1),
      day = padDate(value.getDate()),
      hour = padDate(value.getHours()),
      minutes = padDate(value.getMinutes()),
      seconds = padDate(value.getSeconds());
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
});

new Vue({
  router,
  el: '#app',
  render: h => h(App)
});

const padDate = function (val) {
  val = val < 10 ? '0' + val : val;
  return val
}