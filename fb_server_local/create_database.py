import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  passwd="1",
  database="CHATBOTFB"
)

mycursor = mydb.cursor()

mycursor.execute("SHOW DATABASES")

for x in mycursor:
  print(x)

mycursor.execute("CREATE TABLE STATUS (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY ,status INT(6))")