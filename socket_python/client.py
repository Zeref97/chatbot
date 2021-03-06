#!/usr/bin/env python3

import random
import socket, select
from time import gmtime, strftime
from random import randint
import time
import os

image = "/home/tan/Videos/video00.mp4"

HOST = '127.0.0.1'
PORT = 6666

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_address = (HOST, PORT)
sock.connect(server_address)

try:
    # open image
    myfile = open(image, 'rb')
    size = os.path.getsize(image)
    data = myfile.read(size)
    sock.sendall(data)
    myfile.close()
finally:
    sock.close()
