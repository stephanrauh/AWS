node get-api-url.js

export api_url=$(<api-url.txt)

echo $api_url

curl -X GET  -H "Content-Type: application/json" $api_url
curl -X GET  -H "Content-Type: application/json" $api_url/test/


# -H "x-api-key: my-api-key" -d '{"key":"12345678901234567890"}'