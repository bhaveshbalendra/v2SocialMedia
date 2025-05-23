import { io } from "socket.io-client";
import { socketCreds } from "../config/configs";

export const socket = io(socketCreds.backendUrl);
