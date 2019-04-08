// Every contest seems to have a contest id, change it to the one you need
// The ids can be found at https://codejam.googleapis.com/poll?p=e30 (you'll need to use a base 64 decoder to get a json object with all contests)
var contest_id = "0000000000051705";

// The url of the scoreboard
var site_url = "https://codejam.googleapis.com/scoreboard/" + contest_id + "/poll?p=";

// The country that is being filtered
var country = "Lithuania";


////////////////////////////////////////////////////////////////
// The following functions are magic copied from the js files found in the contest website

var atob = require('atob');
var Base64 = require('js-base64').Base64;
var request = require('request')
var fromCharCode = String.fromCharCode

var re_btou=/[À-ß][-¿]|[à-ï][-¿]{2}|[ð-÷][-¿]{3}/g;
function cb_btou(e){
	switch(e.length){
		case 4:
			var t=(7&e.charCodeAt(0))<<18|(63&e.charCodeAt(1))<<12|(63&e.charCodeAt(2))<<6|63&e.charCodeAt(3),
				r=t-65536;
			return fromCharCode((r>>>10)+55296)+fromCharCode((1023&r)+56320);
		case 3:
			return fromCharCode((15&e.charCodeAt(0))<<12|(63&e.charCodeAt(1))<<6|63&e.charCodeAt(2));
		default:
			return fromCharCode((31&e.charCodeAt(0))<<6|63&e.charCodeAt(1));
	}
}
function btou(e){
	return e.replace(re_btou,cb_btou)
}
function _decode(e){
	return btou(atob(e))
}
function decode(e){
	return _decode((e+"").replace(/[-_]/g,function(e){
		return"-"==e?"+":"/"
	}).replace(/[^A-Za-z0-9\+\/]/g,""))
}

////////////////////////////////////////////////////////////////////////////////////////////

// Gets scoreboard of num_users participants starting from min_rank
// This includes the scores as well as additional info about the contest
async function get_scoreboard(min_rank, num_users){
	var request_object = {
	    min_rank: min_rank,
	    num_consecutive_users: num_users
	};
	var request_string = Base64.encodeURI(JSON.stringify(request_object));
	return new Promise((resolve, reject) => {
		request(site_url + request_string, function (error, response, body) {
			var response_object = JSON.parse(decode(body));
			resolve(response_object);
		}
	)});
}

// Get scores of num_users participants starting from min_rank
async function get_scoreboard_entries(min_rank, num_users){
	return (await get_scoreboard(min_rank, num_users)).user_scores;
}

// Print all participants from the specified country with their rank and score
async function print_all_from_country(){
	// There seems to be a limit to the iteration_increment. 
	// Anything significantly larger than 200 seems to return an empty list
	var iteration_increment = 200;

	var scoreboard_size = (await get_scoreboard(1, 1)).full_scoreboard_size;

	for(min_rank = 1; min_rank < scoreboard_size; min_rank += iteration_increment){
		var new_entries = await get_scoreboard_entries(min_rank, Math.min(scoreboard_size - min_rank + 1, iteration_increment));
		for(user of new_entries){
			if(user.country == country){
				console.log(user.displayname, user.rank, user.score_1)
			}
		}
	}
}
// initial call
print_all_from_country()