$(function() {

    var website = "http://localhost:3000";

    $(".login-validation").on("click", function() {
        $(".flash-message").text("");
        if ($(this).text() === "Currently Logged In. Click Here To Log Out") {
            localStorage.removeItem("wordmill_jwt");
            $(this).text("Not Logged In ")


        }

    });

    $('.user-login').on('submit', function(e) {

        e.preventDefault();
        $(".flash-message").text("");
        localStorage.removeItem("wordmill_jwt");
        var $email = $("input[name='login-email']").val();
        var $password = $("input[name='login-password']").val();

        $.post(website + "/login", {
            email: $email,
            password: $password
        }, function(data) {

            if (data) {

                localStorage.setItem("wordmill_jwt", data);
                $(".login-validation").text("Currently Logged In. Click Here To Log Out");
                console.log("logged in");

            } 

        }).fail(function(response) {
            $(".flash-message").text(response.responseJSON);

            for(var prop in response){
                console.log(prop + ":" + response[prop])
            }
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
        $(".flash-message").text("");
        localStorage.removeItem("wordmill_jwt");
        var $username = $("input[name='username']").val();
        var $email = $("input[name='email']").val();
        var $password = $("input[name='password']").val();
        var user = {
            username: $username,
            email: $email,
            password: $password
        };
       

        $.post(website + "/register", {
            username: $username,
            email: $email,
            password: $password
        }, function(data) {
            localStorage.removeItem("wordmill_jwt");

            if (data) {

                localStorage.setItem("wordmill_jwt", data);
                $(".login-validation").text("Currently Logged In. Click Here To Log Out");

            } 

        }).fail(function(response){
            $(".flash-message").text(response.responseJSON);
        });

    });
    //___________________________________________________END register

});