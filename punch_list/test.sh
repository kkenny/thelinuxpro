URL='https://punchlist-1561043639952.firebaseio.com'
AUTH_TOKEN='Xs2tPGdB6IhpLGopIabq4CNXK2W3GOAD84nOvglA'

function delete() {
	curl -X DELETE "${URL}/${1}?auth=${AUTH_TOKEN}"
}

function create() {
	curl -X POST -d '{
    "nDate": "July 31, 2019 22:00",
    "subject": "Threat Model for Unlinked Daemons",
    "priority": 1,
    "progress": "new",
    "notes": "",
    "tags": [
      "work",
      "vuln management"
    ]
	}' "${URL}/punches.json?auth=${AUTH_TOKEN}"
}

function getMeta() {
	curl -X GET "${URL}/meta.json?print=pretty&auth=${AUTH_TOKEN}"
}

function getPunches() {
	curl -X GET "${URL}/punches.json?print=pretty&auth=${AUTH_TOKEN}"
}

#create

getMeta

getPunches
