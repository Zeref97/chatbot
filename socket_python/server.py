#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import socket
import os

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('', 6666)) #if the clients/server are on different network you shall bind to ('', port)

s.listen(10)
c, addr = s.accept()
print('{} connected.'.format(addr))

f = open("/home/tan/Videos/video00.mp4", "rb")
l = os.path.getsize("/home/tan/Videos/video00.mp4")
m = f.read(l)
c.sendall(m)
f.close()
s.close()
print("Done sending...")