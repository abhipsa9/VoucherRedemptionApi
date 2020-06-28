# VoucherRedemptionApi
Api for generate a voucher, JWT token authentication, redeem a voucher etc.


add the model files in a seperate folder in your source
add your route files in a seperate folder in you source

list out the API's as below:

http://localhost:3002/serverstatus (GET)
for checking server connection is working fine

http://localhost:3002/user (GET)
dummy check


http://localhost:3002/user/login (POST)
request body sample
{
	"email":"test@gmail.com",
	"password":"123456"
}


http://localhost:3002/user/alluser (GET)
required admin login
email:admin@admin.com
password:admin

steps...
first login,
get the JWT token
then GET request


http://localhost:3002/user/signup (POST)
request body sample
{
	"email":"test@gmail.com",
	"password":"123456"
}

http://localhost:3002/voucher (GET)

http://localhost:3002/voucher/generatevoucher
required user login
header param: Authorization:tokenvalue
request body sample
{
	"amount":8000
}


http://localhost:3002/voucher/allvouchers (GET)
required admin login
email:admin@admin.com
password:admin

steps...
first login,
get the JWT token
then GET request


http://localhost:3002/voucher/myvoucherlist (GET)
required user login
header param: Authorization:tokenvalue

http://localhost:3002/voucher/redeemmyvoucher (POST)
required user login
header param: Authorization:tokenvalue
request body sample
{
	"amount":3500,
    "vouchernumber":"VCD8975521880",
    "pin": "725411"
}



http://localhost:3002/voucher/getvoucherdetail/:vouchernumber
required admin login
email:admin@admin.com
password:admin

example:
vouchernumber is here VCD8975521880 ==> http://localhost:3002/voucher/getvoucherdetail/VCD8975521880
