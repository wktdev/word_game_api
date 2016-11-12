 /*

     When user opens app, check local storage for current settings.



    */

 "use strict";

 $(document).foundation();
 var MODULE = (function Module() {

     var app = {
         alphabet: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
         letterPoints: {
             a: 1,
             b: 5,
             c: 3,
             d: 3,
             e: 1,
             f: 5,
             g: 4,
             h: 4,
             i: 1,
             j: 7,
             k: 6,
             l: 2,
             m: 4,
             n: 2,
             o: 1,
             p: 3,
             q: 7,
             r: 1,
             s: 2,
             t: 2,
             u: 3,
             v: 6,
             w: 6,
             x: 7,
             y: 5,
             z: 7
         },
         questionCount: 0,
         currentLevel: 0,
         levelsCompleted: [],
         levelWordList: [],
         currentWord: undefined,
         userSubmittedAnswer: undefined,
         matrix: [],
         wordLength: undefined,
         usersCorrectAnswers: [],
         columnMovePoints: 0,
         totalPoints: 0,

         //_______________________________________BEGIN when user opens app check for current user GAME localstorage data


         getLocalStorageUserGameData: function() {

             var stringData = localStorage.getItem("wordmill_user_game_data");
             var objData = JSON.parse(stringData);
             console.log(objData);
             return objData;
         },


         getAndSetUserDataFromLocalStorageToApp: function() {

             // on window load

            window.onload = function() {

                 var userDataFromLocalStorage = app.getLocalStorageUserGameData();
                 console.log(userDataFromLocalStorage);

                 try {

                     app.questionCount = userDataFromLocalStorage.questionCount;
                     app.currentLevel = userDataFromLocalStorage.currentLevel;
                     app.levelsCompleted = userDataFromLocalStorage.levelsCompleted;
                     app.levelWordList = userDataFromLocalStorage.levelWordList;
                     app.currentWord = userDataFromLocalStorage.currentWord;
                     app.userSubmittedAnswer = userDataFromLocalStorage.userSubmittedAnswer;
                     app.matrix = userDataFromLocalStorage.matrix;
                     app.wordLength = userDataFromLocalStorage.wordLength;
                     app.usersCorrectAnswers = userDataFromLocalStorage.usersCorrectAnswers;
                     app.numberOfCorrectAnswers = app.usersCorrectAnswers.length
                     app.columnMovePoints = userDataFromLocalStorage.columnMovePoints;
                     app.totalPoints = userDataFromLocalStorage.totalPoints;


                 $(".total-points").text(userDataFromLocalStorage.totalPoints + "");
                 $(".current-medal").text();



                 app.usersCorrectAnswers.forEach(function(val){

                     $(".correct-answers").append("<li>" +val+ "</li>"); // loop

                 })
                
                 $(".static-column-point").text();
                 $(".letter-moves").text();
                 $(".letters-used").append(); // loop
        

                 } catch (e) {
                     
                     throw "New game"
                 }



            }

         },

         //_______________________________________END when user opens app check for current user GAME localstorage data


         //_______________________________________BEGIN functions to set user GAME data to localstorage on each answer submission

         getAllUserLevelClientData: function() {

             var userData = {

                 questionCount: app.questionCount,
                 currentLevel: app.currentLevel,
                 levelsCompleted: app.levelsCompleted,
                 levelWordList: app.levelWordList,
                 currentWord: app.currentWord,
                 userSubmittedAnswer: app.userSubmittedAnswer,
                 matrix: app.matrix,
                 wordLength: app.wordLength,
                 usersCorrectAnswers: app.usersCorrectAnswers,
                 columnMovePoints: app.columnMovePoints,
                 totalPoints: app.totalPoints

             };

             return userData;

         },

         storeUserClientDataInLocalStorage: function() {

             localStorage.removeItem("wordmill_user_game_data");
             var userData = app.getAllUserLevelClientData();
             var userDataString = JSON.stringify(userData);
             localStorage.setItem("wordmill_user_game_data", userDataString);

         },

         //________________________________________END functions to set user GAME data to localstorage on each answer submission 



         createMatchArray: function(wordLength) {
             var data = [];
             var length = wordLength; // user defined length

             for (var i = 0; i < length; i++) {
                 data.push(i);
             }

             return data;

         },

         findSurroundingLetters: function(alphabet, letter) {
             var rowOfLetters = [];
             var indexOfLetter = alphabet.indexOf(letter);
             var first = alphabet[indexOfLetter - 2];
             var second = alphabet[indexOfLetter - 1];
             var third = letter;
             var fourth = alphabet[indexOfLetter + 1];
             var fifth = alphabet[indexOfLetter + 2];

             if (second === undefined) {
                 second = "z";
                 first = "y";
             }

             if (first === undefined) {
                 first = "z";
             }

             if (fourth === undefined) {
                 fourth = "a";
                 fifth = "b";
             }

             if (fifth === undefined) {
                 fifth = "a";
             }

             rowOfLetters.push(first, second, third, fourth, fifth);


             return rowOfLetters;

         },

         createInterface: function(arr) {

             $("#letter-containers").empty();

             arr.forEach(function(val, index) {

                 $("#letter-containers").append("<ul class ='letter-column'id='" + index + "'> </ul>");

                 $("#letter-containers").sortable({
                     axis: 'x',
                     containment: $('#letter-containers').parent().parent()
                 });
                 val.forEach(function(val2) {

                     $(".letter-column").eq(index).append("<li class='letter'>" + val2 + "</li>");

                     $(".letter-column").sortable({
                         axis: 'y',
                         items: ".letter",
                         containment: "parent",

                     });


                 });
             });

             $(".letter-column").append("<img class = 'arrow-image' src='img/arrow.png' alt='two way arrow'/>");

         },

         checkForPreviousAnswer: function(word, arr) {
             if (arr.includes(word)) {
                 console.log("You already guessed " + word + " silly");
                 return true;
             } else {
                 return false;
             }
         },

         checkAnswer: function(arr, word, index) {
             var correct = false;
             arr[index].answers.forEach(function(val) {
                 if (val === word) {
                     correct = true;

                 }
             });
             return correct;
         },







         createWord: function() {
             var selectedWordArr = app.levelWordList[0].word.split("");
             selectedWordArr.forEach(function(val) {
                 app.matrix.push(app.findSurroundingLetters(app.alphabet, val));
             });
             app.createInterface(app.matrix);
             $(".total-number-of-answers").text(app.levelWordList[0].answers.length);

         },

         checkUserAnswer: function(arr, indexVal, word) {
             var correct = false;
             arr[indexVal].answers.forEach(function(val) {
                 if (val === word) {
                     correct = true;
                 }
             });

             return correct;
         },
         //______________________________________BEGIN Check how many columns moved on user submission
         pointCheck_checkIfColumnsHaveNotMoved: function() {
             var orderOfIds = [];



             var matchArr = app.createMatchArray(app.wordLength);

             $(".letter-column").each(function() {
                 orderOfIds.push(+$(this).attr('id'));
             });



             function checkArrayEquality(arr1, arr2) {

                 if (arr1.length !== arr2.length)
                     return false;
                 for (var i = arr1.length; i--;) {
                     if (arr1[i] !== arr2[i])
                         return false;
                 }

                 return true;
             }



             var answer = checkArrayEquality(matchArr, orderOfIds);

             return answer;



         },



         pointCheck_getLettersThatHaveChanged: function(userSubmittedWord) {

             function getDifferentValues(levelWord, userAnswer) {

                 var differingLetters = [];
                 var originalGameWord = levelWord.split('');
                 if (originalGameWord.length !== userAnswer.length)
                     return false;
                 for (var i = originalGameWord.length; i--;) {
                     if (originalGameWord[i] !== userAnswer[i]) {
                         differingLetters.push(userAnswer[i]);
                     }
                 }

                 return differingLetters;
             }

             var differingLetters = getDifferentValues(app.currentWord, userSubmittedWord);

             return differingLetters;

         },


         pointCheck_getNumberOfDifferentLetters: function() {
             var arr = app.pointCheck_getLettersThatHaveChanged(app.userSubmittedAnswer);
             var answer = arr.length;
             console.log("You have changed " + arr.length + " number of letters.+" + arr.length + " points");
             return answer;
         },

         pointCheck_scoreLetters: function(arr) {

             var total = arr.reduce(function(start, val) {
                 start += app.letterPoints[val];

                 return start;

             }, 0);

             console.log("Letter points : " + total);

             return total;

         },



         getMedal: function() {

             var allCorrect = app.levelWordList[app.questionCount].answers.length;
             var userAnswers = app.usersCorrectAnswers.length;
             var getPercent = userAnswers / allCorrect;
             var percentValue = (getPercent * 100).toFixed(2);
             console.log(percentValue);
             console.log(allCorrect - 1);
             console.log("user correct answers: " + userAnswers);

             if (percentValue >= 100) {
                 return "Platinum";

             } else if ((userAnswers === (allCorrect - 1)) || (percentValue >= 90 && percentValue <= 99)) {
                 return "Gold";

             } else if (percentValue >= 75 && percentValue <= 89) {
                 return "Silver";

             } else if (percentValue >= 60 && percentValue <= 74) {
                 return "Bronze";

             } else {
                 return "None";
             }


         },

         setMedal: function() {

         },

         tallyPoints: function(userSubmittedWord) {
             app.columnMovePoints = 0;
             if (app.pointCheck_checkIfColumnsHaveNotMoved()) {
                 app.totalPoints += 2;
                 app.columnMovePoints = 2;
                 console.log("Columns have not moved. +2 points ");
             }

             app.totalPoints += app.pointCheck_getNumberOfDifferentLetters();

             var changedLetters = app.pointCheck_getLettersThatHaveChanged(userSubmittedWord);

             app.totalPoints += app.pointCheck_scoreLetters(changedLetters);

             console.log("total points so far: " + app.totalPoints);

         },

         displayUsersAnswers: function() {
             $(".correct-answers").empty();
             app.usersCorrectAnswers.forEach(function(val) {
                 $(".correct-answers").append("<li class='correct-word'>" + val + "   </li>");
             });
         },

         displayColumnMovePoints: function() {

             $(".static-column-point").text(" +" + app.columnMovePoints);

         },

         displayNumberOfChangedLettersPoints: function() {
             $(".letter-moves").text(" +" + app.pointCheck_getNumberOfDifferentLetters());

         },

         displayLetterPoints: function(userSubmittedWord) {
             var changedLetters = app.pointCheck_getLettersThatHaveChanged(userSubmittedWord);
             console.log("changed letters weeeee:" + changedLetters);
             $(".letters-used").empty();
             changedLetters.forEach(function(val) {

                 $(".letters-used").append("<li>" + val + " +" + app.letterPoints[val] + "<li>");



             });


         },

         displayWrongAnswerPoints: function() {

             $(".static-column-point").text("0");
             $(".letter-moves").text("0");
             $(".letters-used ").empty();

         },

         displayMedal: function() {
             $(".current-medal").empty();
             $(".current-medal").text(app.getMedal());

         },

         //______________________________________END Check how many columns moved on user submission
         userSubmit: function() {
             $("#answer-submit-button").on("click", function() {

                 var word = "";

                 for (var i = 0; i <= app.wordLength; i += 1) {

                     var x = $("#letter-containers").children().eq(i).children().eq(2).text();
                     word += x;
                 }
                 app.userSubmittedAnswer = word;
                 var answer = app.checkAnswer(app.levelWordList, word, app.questionCount);
                 var isPreviousAnswer = app.checkForPreviousAnswer(word, app.usersCorrectAnswers);

                 if (answer && (!isPreviousAnswer)) {
                     app.usersCorrectAnswers.push(word);
                     app.tallyPoints(word);
                     $(".total-points").html(app.totalPoints);



                     var centerRow = $("#letter-containers > ul > li:nth-child(3) ");
                     centerRow.effect("bounce", {
                         times: 2
                     }, 1200, function() {

                         $("#letter-containers").fadeOut(700, function() {
                             app.createInterface(app.matrix);
                             $(this).fadeIn(700);

                         });
                     });

                     app.storeUserClientDataInLocalStorage();


                     app.displayUsersAnswers();
                     app.displayColumnMovePoints();
                     app.displayNumberOfChangedLettersPoints();
                     app.displayLetterPoints(word);
                     app.displayMedal();


                 } else {


                     $('.letter').animate({
                         backgroundColor: "#EC4040"
                     }, 200, function() {

                     }).animate({
                         backgroundColor: "hsla(231, 48%, 48%, 0.34)"
                     }, 100, function() {
                         $('.letter:nth-child(3)').css("background-color", 'rgba(255, 235, 59, 0.51)');
                         app.createInterface(app.matrix);
                     });

                     app.displayWrongAnswerPoints();


                 }

                 $(".correct-answer-count").text(app.usersCorrectAnswers.length);


                 console.log(app.getMedal());


             });

         },

         checkIfLoggedIn: function() {


             var jwtFromBrowser = localStorage.getItem('wordmill_jwt');

             if (jwtFromBrowser) {

                 $(".user-login").text("Log out");
                 $(".user-login").attr("href", "index.html");
                 $(".user-login").addClass("logged-in");


                 $(".logged-in").on("click", function(e) {
                     e.preventDefault();
                     $(".user-login").text("Log In");
                     $(".user-login").attr("href", "login_register.html");
                     $(this).unbind('click');
                     $(this).removeClass("logged-in");
                     localStorage.removeItem("wordmill_jwt");
                 });



             } else {
                 $(".user-login").text("Log In");
                 $(".user-login").attr("href", "login_register.html");
             }

             if ($(".user-login").text() === "Log In") {

                 $(".user-login").on("click", function() {
                     window.location.replace("login_register.html");

                 });

             }

         },



         run: function(wordData) {
             app.getAndSetUserDataFromLocalStorageToApp();
             app.checkIfLoggedIn();
             app.userSubmit();
             app.levelWordList = wordData;
             app.currentWord = app.levelWordList[app.questionCount].word;
             app.wordLength = wordData[0].word.length;
             app.createWord(app.questionCount);
             app.getLocalStorageUserGameData();

         }
     };


     return app;


 }());



 var app = MODULE;
 app.run(gameWordList);
