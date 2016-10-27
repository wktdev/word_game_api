$(function() {

    var website = "http://localhost:3000";

    $('.user-login').on('submit', function(e) {

        e.preventDefault();
        var $email = $("input[name='login-email']").val();
        var $password = $("input[name='login-password']").val();

        $.post(website + "/login", { email: $email, password: $password }, function(data) {

            if (data !== 404) {

                localStorage.setItem("wordmill_jwt", data);
                $(".login-validation").text("logged in");
                console.log("logged in")

            } else {

                console.log(data)
            }

        });
    });


    //___________________________________________________BEGIN get api level data
    $(".get-level-data").on("submit", function(e) {
        e.preventDefault();
        var jwtFromBrowser = localStorage.getItem('wordmill_jwt');

        $.post(website + "/api/level", { jwt: jwtFromBrowser }, function(data) {

            console.log(data);

        });
    });
    //____________________________________________________END get api level data


    //_________________________________________________BEGIN register

    $('.user-register').on('submit', function(e) {
        e.preventDefault();

        var $username = $("input[name='username']").val();
        var $email = $("input[name='email']").val();
        var $password = $("input[name='password']").val();
        var user = { username: $username, email: $email, password: $password };
        console.log(user)

        $.post(website + "/register", { username: $username, email: $email, password: $password }, function(data) {
            localStorage.removeItem("wordmill_jwt");



            if (data !== 404) {

                localStorage.setItem("wordmill_jwt", data);
                $(".login-validation").text("logged in");

            } else {

                console.log(data)
            }

        });

    });
    //___________________________________________________END register



});
