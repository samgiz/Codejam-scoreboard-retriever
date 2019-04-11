////////////////////////////////////////////////////////////////
// The following functions perform some magic modified base64 conversion 
// Copied from the js files found in the Codejam contest website

var atob = require('atob')
var Base64 = require('js-base64').Base64
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

// Keep in mind that most of the competitions were held on the old platform. 
// In particular, Codejam results are available from 2018 (at least at the moment of writing)
function get_contests(){
	var request_object = {}
	var request_string = Base64.encodeURI(JSON.stringify(request_object))
	return new Promise((resolve, reject) => {
		request("https://codejam.googleapis.com/poll?p=" + request_string, (error, response, body) => {
			var response_object = JSON.parse(decode(body)).adventures
			// The most recent competition will be first
			response_object.sort((a, b) => {
				return b.reg_start_ms - a.reg_start_ms
			})
			resolve(response_object)
		}
	)})
}

get_contests().then((contests) => {
	console.log("Ids of Google competitions:\n")
	for(contest of contests){
		console.log(contest.title)
		contest.challenges.sort((a, b) => {
			return a.start_ms - b.start_ms
		})
		for(round of contest.challenges){
			console.log("    ", round.title, "id:", round.id)
		}
	}
})