window.onload = function() {
    var usernames = JSON.parse('{{ usernames_json | safe }}');
    var userListDiv = document.getElementById('userList');

    usernames.forEach(function(user) {
        var p = document.createElement('p');
        p.textContent = user;
        userListDiv.appendChild(p);
    });
};