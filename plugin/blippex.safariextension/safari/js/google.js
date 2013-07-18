if (window.top === window && /google/i.test(window.location.host)) {

  var google = {
    engine: 'google',
    query: '',
    init: function() {
      this.setListeners();
      safari.self.tab.dispatchMessage('message', {
        'action': 'search',
        'engine': this.engine,
        'query': this.getQueryFromURL()
      });
      setInterval(function() {
        if (google.href != document.location.href) {
          google.href = document.location.href
          safari.self.tab.dispatchMessage('message', {
            'action': 'search',
            'engine': google.engine,
            'query': google.getQueryFromURL()
          });
        }
      }, 500);
      document.querySelector("[name=q]").addEventListener('keyup', function(e) {
        var query = google.getQuery();

        var fn = function() {
          google.qsearch();
        };

        if (e.keyCode == 40 || e.keyCode == 38) fn = function() {
          google.qsearch(true);
        };

        clearTimeout(ddg_timer);
        ddg_timer = setTimeout(function() {
          fn();
        }, 700);
        document.getElementsByClassName("gssb_c")[0].onclick = function() {
          google.qsearch(true);
        };
      }, true);
      document.querySelector("[name=btnG]").addEventListener('click', function() {
        google.qsearch();
      }, true);
    },
    setListeners: function() {

      safari.self.addEventListener("message", function(messageEvent) {
        switch (messageEvent.message.type) {
        case 'search':
          if (document.getElementById(messageEvent.message.where.id)) {
            var pLayer = document.getElementById('blippex');
            var newDiv = document.createElement('div');
            newDiv.innerHTML = messageEvent.message.tpl;
            if (pLayer) {
              pLayer.parentNode.replaceChild(newDiv, pLayer);
            } else if (messageEvent.message.where.position == 'end') {
              document.getElementById(messageEvent.message.where.id).appendChild(newDiv);
            } else {
              document.getElementById(messageEvent.message.where.id).insertBefore(newDiv, document.getElementById(messageEvent.message.where.id).firstChild);
            }
            google.addEventListener('blippex-button-close', function(){
              newDiv.style.display = 'none';
              safari.self.tab.dispatchMessage('message', {
                'action':   'disable_overlay',
                'engine':   google.engine
              });
            });
          }
          break;
        default:
        }
      });
    },
	addEventListener: function(id, handler, event){
    event = event || 'click';
		document.getElementById(id).parentNode.replaceChild(document.getElementById(id).cloneNode(true), document.getElementById(id));
		document.getElementById(id).addEventListener(event, handler);
	},
    getQueryFromURL: function() {
      var regex = new RegExp('[\?\&]q=([^\&#]+)');
      if (regex.test(window.location.href)) {
        var q = window.location.href.split(regex);
        q = q[q.length - 2].replace(/\+/g, " ");
        return decodeURIComponent(q);
      }
    },
    getQuery: function(direct) {
      var instant = document.getElementsByClassName("gssb_a");
      if (instant.length !== 0 && !direct) {
        var selected_instant = instant[0];

        var query = selected_instant.childNodes[0].childNodes[0].childNodes[0].
        childNodes[0].childNodes[0].childNodes[0].innerHTML;
        query = query.replace(/<\/?(?!\!)[^>]*>/gi, '');

        return query;
      } else {
        return document.getElementsByName('q')[0].value;
      }
    },
    qsearch: function(direct) {
      var query = google.getQuery(direct);
      google.query = query;
      safari.self.tab.dispatchMessage('message', {
        'action': 'search',
        'engine': google.engine,
        'query': query
      });
    }
  }

  google.init();
}