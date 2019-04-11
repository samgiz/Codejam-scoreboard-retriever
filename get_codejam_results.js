// Every contest seems to have a contest id, change it to the one you need
// The ids can be found at https://codejam.googleapis.com/poll?p=e30 (you'll need to use a base 64 decoder to get a json object with all contests)
var contest_id = "0000000000051705"

// The url of the scoreboard
var site_url = "https://codejam.googleapis.com/scoreboard/" + contest_id + "/poll?p="

// The country that is being filtered
var country = "Lithuania"

// Make sure that the country above is one of the countries below
// Note that there is also an option "Decline to Answer"
var possible_countries = ['Afghanistan', '\xC5land Islands', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antarctica', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Bouvet Island', 'Brazil', 'British Indian Ocean Territory', 'British Virgin Islands', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Caribbean Netherlands', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island', 'Cocos [Keeling] Islands', 'Colombia', 'Comoros', 'Congo [DRC]', 'Congo [Republic]', 'Cook Islands', 'Costa Rica', 'C\xF4te d\'Ivoire', 'Croatia', 'Cuba', 'Cura\xE7ao', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands [Islas Malvinas]', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia', 'French Southern Territories', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Heard Island and McDonald Islands', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia [FYROM]', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Myanmar [Burma]', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'North Korea', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn Islands', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'R\xE9union', 'Romania', 'Russia', 'Rwanda', 'Saint Barth\xE9lemy', 'Saint Helena', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Martin', 'Saint Pierre and Miquelon', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'S\xE3o Tom\xE9 and Pr\xEDncipe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Sint Maarten', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Georgia and the South Sandwich Islands', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Svalbard and Jan Mayen', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'U.S. Minor Outlying Islands', 'U.S. Virgin Islands', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Wallis and Futuna', 'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe', 'Decline to Answer']

if(!possible_countries.includes(country)){
	console.log("The provided country is not one of the available ones. \nMake sure you didn't make a typo and try again")
	process.exit()
}

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

// Gets scoreboard of num_users participants starting from min_rank
// This includes the scores as well as additional info about the contest
function get_scoreboard(min_rank, num_users){
	var request_object = {
	    min_rank: min_rank,
	    num_consecutive_users: num_users
	}
	var request_string = Base64.encodeURI(JSON.stringify(request_object))
	return new Promise((resolve, reject) => {
		request(site_url + request_string, (error, response, body) => {
			var response_object = JSON.parse(decode(body))
			resolve(response_object)
		}
	)})
}

// Extract user scores from a scoreboard
function get_user_scores(min_rank, num_users){
	return get_scoreboard(min_rank, num_users).then((scorebard) => {
		return scorebard.user_scores
	})
}

// Add leading zeros to integer so it has >=2 digits
function pad_zeros(a){
	if(a >= 100) return str(a)
	return(100+a+"").slice(-2)
}

// Convert from score_2 in retrieved information to human readable format (HH:MM:SS)
// score_2 stores time as negative microseconds
function score_2_to_time(score_2){
	var s = -score_2/1000000
	var date = new Date(null);
	date.setSeconds(s);
	return pad_zeros(date.getUTCHours() + (date.getUTCDate()-1)*24) + ':' 
	       + pad_zeros(date.getUTCMinutes()) + ':' +  
	       + pad_zeros(date.getUTCSeconds())
}

// Print all participants from the specified country with their rank and score
async function print_all_from_country(){
	// There seems to be a limit to the iteration_increment. 
	// Anything significantly larger than 200 seems to return an empty list
	var iteration_increment = 200

	// Initial call to get the scoreboard size
	var scoreboard_size = (await get_scoreboard(1, 1)).full_scoreboard_size

	// List to store the request promises
	block_entries = []
	for(min_rank = 1; min_rank < scoreboard_size; min_rank += iteration_increment){
		block_entries.push(get_user_scores(min_rank, Math.min(scoreboard_size - min_rank + 1, iteration_increment)))
	}

	// Process elements when all promises are resolved
	Promise.all(block_entries).then((block_entries) => {
		// block_entries contains a list of scoreboard objects, at most iteration_increment user scores in each
		for(user_entries of block_entries){
			// user_entries stores at most iteration_increment user objects
			for(user of user_entries){
				// user is a single user object
				if(user.country == country){
					// The following statement assumes that the second score is available and represents negative time in millionths of seconds
					// If this is not the case for some contest, use the commented line instead
					console.log(user.rank + '. ' + user.displayname + ': ' +  user.score_1 + " points in " + score_2_to_time(user.score_2))
					// console.log(user.rank + '. ' + user.displayname + ': ' +  user.score_1 + " points")
				}
			}
		}
	})
}

// initial call
print_all_from_country()