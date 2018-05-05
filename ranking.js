firebase.database()
    .ref('records')
    .orderByChild('average')
    .limitToFirst(10)
    .on('value', function(data) {

        var uniq_key_list = Object.keys(data.val());
        var average_list = uniq_key_list.map(x => data.val()[x]['average']);
        average_list.sort();

        document.getElementById('rank_container').innerHTML = '';

        var ol = document.createElement('ol');
        average_list.forEach(function(avg){
            var li = document.createElement('li');
            li.appendChild(document.createTextNode(avg + ' s'));

            if (avg === records_to_avg()) {
                li.className = 'highlight';
            }

            ol.appendChild(li);
        });

        document.getElementById('rank_container').appendChild(ol);
    });
