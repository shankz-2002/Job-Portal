import { Connection } from './database/connectDb';
import app from './app';
import { createServer } from 'http';
import { setupSignalingServer } from './WebRTC/signaling';
import 'dotenv/config'
const PORT = process.env.PORT || 5000;
const server = createServer(app);
setupSignalingServer(server);

server.listen(PORT, () => {
    Connection()
    console.log(`Server running at http://localhost:${PORT}`);

})


