#!/usr/bin/env python3

import random
import socket, select, sys, json
from time import gmtime, strftime
from random import randint
# import asyncio
# import websockets

# async def hello():
#     async with websockets.connect(
#             'ws://localhost:1337') as websocket:
#         await websocket.send("received")

def main():
    imgcounter = 1
    basename = "out.mp4"

    HOST = ''
    PORT = 8888

    connected_clients_sockets = []

    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((HOST, PORT))
    server_socket.listen(10)

    connected_clients_sockets.append(server_socket)


    while True:

        read_sockets, write_sockets, error_sockets = select.select(connected_clients_sockets, [], [])

        for sock in read_sockets:

            if sock == server_socket:

                sockfd, client_address = server_socket.accept()
                connected_clients_sockets.append(sockfd)
                #print('{} connected.'.format(client_address))

            else:
                try:
                    #myfile = open(basename % imgcounter, 'wb')
                    myfile = open(basename, 'wb')
                    data = None
                    while True:
                        m = sock.recv(1024)
                        data = m
                        if m:
                            while m:
                                m = s=sock.recv(1024)
                                data += m
                            else:
                                break

                    myfile.write(data)
                    myfile.close()
                    #print "sent",
                    sys.stdout.write("sent")
                    sys.stdout.flush()
                    sock.shutdown()
                except:
                    sock.close()
                    connected_clients_sockets.remove(sock)
                    continue
            imgcounter += 1
    server_socket.close() 

if __name__ == '__main__':
    main()
