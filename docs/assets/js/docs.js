$(document).foundation();

$(function() {
  // Equalizer test
  var counter = 0;
  $('#test-eq').on('postEqualized.zf.Equalizer', function() {
    counter++;
    console.log(counter);
  });
  $('#pokemonRed').on('invalid.fndtn.abide', function(e, data) {
    console.log(data);
  });
});

$(function() {
  $('[data-docs-version]').text('v' + Foundation.version);
});


// Analytics 
var _gaq = _gaq || [];
_gaq.push(
  ['_setAccount', 'UA-2195009-2'],
  ['_trackPageview'],
  ['b._setAccount', 'UA-2195009-27'],
  ['b._trackPageview']
);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();