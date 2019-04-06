#!/usr/bin/python3
import requests
import base64
import json

# Every contest seems to have a contest id, change it to the one you need
# The ids can be found at https://codejam.googleapis.com/poll?p=e30 (you'll need to use a base 64 decoder to get a json object with all contests)
contest_id = "0000000000051705"

# Complete site url (except for the request string)
site_url = "https://codejam.googleapis.com/scoreboard/" + contest_id + "/poll?p="

# Country that we filter for in the scoreboard
country = "Lithuania"

# Use base 64 to encode our request string
def encoded_request_string(min_rank, num_users):
	string = '{"min_rank":' + str(min_rank) + ',"num_consecutive_users":' + str(num_users) + '}'
	return base64.b64encode(string.encode())

# Python requires correct padding of the string in order to work correctly
def add_b64_padding(s):
	return s + "==="

# Get num_users scoreboard entries starting from min_rank
# Keep in mind that if num_users is too large, the request returns an empty array. 200 users seems to be close to the maximum amount
def get_scoreboard_entries(min_rank, num_users):
	request_string = encoded_request_string(min_rank, num_users)
	r = requests.get(site_url.encode() + request_string)
	response_string = str(base64.b64decode(add_b64_padding(r.text)), "utf-8")
	return json.loads(response_string)

# Initial call to get scoreboard size
response = get_scoreboard_entries(1, 1)

# Get total number of participants in the scoreboard currently
scoreboard_size = response["full_scoreboard_size"]

# Initialize empty users array
Users = []

# There seems to be a limit to how many users one can ask for in 1 request
# 200 seems to be close to the maximum possible
for min_rank in range(1, scoreboard_size+1, 200):
	try:
		response = get_scoreboard_entries(min_rank, min(200, scoreboard_size-min_rank+1))
		Users.append(response["user_scores"])
	except:
		# Something failed, redo the request
		min_rank -= 200
		continue
	# This part prints out info about scoreboard entries from country
	for user in response["user_scores"]:
		if user["country"] == country:
			print(user["displayname"]+":", str(user["rank"]) + ",", user["score_1"])

# In case you want to do something else with the leaderboard, it is stored in the Users array
# Keep in mind that if the competition has not finished yet, the scoreboard might change while you are retrieving the data, and some users might be missing or appear several times in the list