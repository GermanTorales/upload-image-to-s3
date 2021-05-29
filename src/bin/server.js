import app from "../app/app.js";
import { server_port } from "../config/envVariables.js";
import { loggerInfo } from "../config/winstonConfig.js";

app.listen(server_port, () => loggerInfo.info(`Server on port ${server_port}`));

export default app;
