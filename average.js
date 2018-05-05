firebase.database()
    .ref('records')
    .on('value', function(data) {

        var uniq_key_list = Object.keys(data.val());
        var sum = uniq_key_list.reduce((s, x) => s + parseFloat(data.val()[x]['average']), 0.0);
        var avg = sum / uniq_key_list.length;

        document.getElementById('avg_container').innerHTML = '';

        var p = document.createElement('p');
        p.appendChild(document.createTextNode(avg.toFixed(3) + ' s'));

        document.getElementById('avg_container').appendChild(p);
    });
