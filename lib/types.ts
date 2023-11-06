import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

type SocketServer = NetServer & {
  io: SocketIOServer;
}

type SocketWithIo = Socket & {
  server: SocketServer;
}

export type NextApiResponseServerIo = NextApiResponse & {
  socket: SocketWithIo;
}