import app from "./app";
import { env } from "./config/env";

app.listen(env.PORT, () => {
  console.log(`🚀 DroneTV Backend running on http://localhost:${env.PORT}`);
  console.log(`📡 Health Check: http://localhost:${env.PORT}/api/health`);
  console.log(`📋 Enquiries API: http://localhost:${env.PORT}/api/enquiries`);
});
