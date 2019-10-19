const moment=require('moment');
/* fuction for generate random mail */
function randomNameEmail(){
    var firstname = ["Marquis", "Samir", "Adrien", "Joyce", "Pierce", "Juliette", "Kelton", "Jacob", "Isiah", "Lindsay", "Kian", "Jordyn", "Jaquan", "Anya", "Wayne", "Khalil"];
    var lastname= ["Mills", "Mercer", "Reeves", "Hines", "Sanford", "Irwin", "Koch", "Hinton", "Estes", "Jackson", "Lowe", "Guerra", "Pineda", "Franco", "Cowan", "Krause"];
    var emailprovider= ["gmail.com", "yahoo.com", "outlook.com", "mail.com", "rediff.com"];
    var separator= [".", "", "_"];
    var rand_first = Math.floor(Math.random()*firstname.length); 
    var rand_last = Math.floor(Math.random()*lastname.length);
    var rand_emailprovider = Math.floor(Math.random()*emailprovider.length);
    var rand_separatorIndex = Math.floor(Math.random()*separator.length);
    var rand_firstname = firstname[rand_first];
    var rand_lastname = lastname[rand_last];
    var rand_name = rand_firstname + " " + rand_lastname;
    var rand_separator = separator[rand_separatorIndex];
    var rand_email = rand_firstname + rand_separator + rand_lastname + "@" + emailprovider[rand_emailprovider];
    rand_email = rand_email.toLowerCase();
    var nameEmail = {
        name: rand_name,
        email: rand_email
    };
    return nameEmail;
};

/* fuction for genterate random string for subject or text field  */
function randomString(){
    var verbs, nouns, adjectives, adverbs, preposition;
    nouns = ["bird", "clock", "boy", "plastic", "duck", "teacher", "old lady", "professor", "hamster", "dog"];
    verbs = ["kicked", "ran", "flew", "dodged", "sliced", "rolled", "died", "breathed", "slept", "killed"];
    adjectives = ["beautiful", "lazy", "professional", "lovely", "dumb", "rough", "soft", "hot", "vibrating", "slimy"];
    adverbs = ["slowly", "elegantly", "precisely", "quickly", "sadly", "humbly", "proudly", "shockingly", "calmly", "passionately"];
    preposition = ["down", "into", "up", "on", "upon", "below", "above", "through", "across", "towards"];

    function randGen() {
      return Math.floor(Math.random() * 5);
    }

    function sentence() {
      var rand1 = Math.floor(Math.random() * 10);
      var rand2 = Math.floor(Math.random() * 10);
      var rand3 = Math.floor(Math.random() * 10);
      var rand4 = Math.floor(Math.random() * 10);
      var rand5 = Math.floor(Math.random() * 10);
      var rand6 = Math.floor(Math.random() * 10);
      var content = "The " + adjectives[rand1] + " " + nouns[rand2] + " " + adverbs[rand3] + " " + verbs[rand4] + " because some " + nouns[rand1] + " " + adverbs[rand1] + " " + verbs[rand1] + " " + preposition[rand1] + " a " + adjectives[rand2] + " " + nouns[rand5] + " which, became a " + adjectives[rand3] + ", " + adjectives[rand4] + " " + nouns[rand6] + ".";
      return content;
    };
    var thisString = sentence();
    return thisString;
};

/*  this function genterate complete email fields value  for email object field */
function databasePopulation(){
    var from = {
        name: "Team Exambazaar",
        email: "team@exambazaar.com",
    };
    var randomFrom = randomNameEmail();
    var randomTo = randomNameEmail();
    var randomCC = randomNameEmail();
    var randomBCC = randomNameEmail();   
    var randomSubject = randomString();
    var randomBody = randomString();
     newEmail = {
        from: randomFrom,
        to: [randomTo],
        cc: randomCC,
        bcc: randomBCC,
        subject: randomSubject,
        text: randomBody,
        _created: moment().toDate(),
        _lastModified: moment().toDate(),
    };
     
};
databasePopulation();
module.exports=newEmail;
/*  for(i=0;i<10;i++){
    databasePopulation();
 } */


