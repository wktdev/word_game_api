$(function() {

    var website = "http://localhost:3000";

    $(".login-validation").on("click", function() {

        if ($(this).text() === "Currently Logged In. Click Here To Log Out") {
            localStorage.removeItem("wordmill_jwt");
            $(this).text("Not Logged In ")


        }

    });

    $('.user-login').on('submit', function(e) {

        e.preventDefault();
        localStorage.removeItem("wordmill_jwt");
        var $email = $("input[name='login-email']").val();
        var $password = $("input[name='login-password']").val();

        $.post(website + "/login", {
            email: $email,
            password: $password
        }, function(data) {

            if (data !== 404) {

                localStorage.setItem("wordmill_jwt", data);
                $(".login-validation").text("Currently Logged In. Click Here To Log Out");
                console.log("logged in");


            } else {

                console.log(data)
                $(".flash-message").text(data)
            }

        }).fail(function(response) {
            alert('Error: ' + response.responseText);
        });
    });


    //___________________________________________________BEGIN get api level data
    $(".get-level-data").on("submit", function(e) {
        e.preventDefault();
        var jwtFromBrowser = localStorage.getItem('wordmill_jwt');

        $.post(website + "/api/level", {
            jwt: jwtFromBrowser
        }, function(data) {

            console.log(data);

        });
    });
    //____________________________________________________END get api level data


    //_________________________________________________BEGIN register

    $('.user-register').on('submit', function(e) {
        e.preventDefault();
        localStorage.removeItem("wordmill_jwt");
        var $username = $("input[name='username']").val();
        var $email = $("input[name='email']").val();
        var $password = $("input[name='password']").val();
        var user = {
            username: $username,
            email: $email,
            password: $password
        };
        console.log(user)

        $.post(website + "/register", {
            username: $username,
            email: $email,
            password: $password
        }, function(data) {
            localStorage.removeItem("wordmill_jwt");



            if (data !== 404) {

                localStorage.setItem("wordmill_jwt", data);
                $(".login-validation").text("Currently Logged In. Click Here To Log Out");

            } else {

                console.log(data)
                $(".flash-message").text("Either that email is already in use your you typed the wrong password")
            }

        });

    });
    //___________________________________________________END register



});