const { defineConfig } = require('cypress');
const { beforeRunHook, afterRunHook } = require('cypress-mochawesome-reporter/lib');
const mysql = require('mysql2');
const { Client } = require('ssh2');
const fs = require('fs');

// Read the private key as a string
const privateKey = fs.readFileSync('id_rsa', 'utf8');

module.exports = defineConfig({
  projectId: 'rbj641',
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'custom-title',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: true,
    reportFilename: "Report-[datetime]-report",
    timestamp: "longDate"
  },
  e2e: {
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      on("task", {
        queryDb: (query) => {
          return queryTestDb(query, config);
        },
      });

      on('before:run', async (details) => {
        console.log('override before:run');
        await beforeRunHook(details);
      });

      on('after:run', async () => {
        console.log('override after:run');
        await afterRunHook();
      });

      require('cypress-mochawesome-reporter/plugin')(on);
    },
    retries: {
      runMode: 0,
      openMode: 0
    },
    baseUrl: 'https://mster.cargeautomation.com/',
    users: {
      user1: {
        username: "automation9@gmail.com",
        password: ""
      },
      user2: {
        username: "automationc@yopmail.com",
        password: ""
      }
    },
    chromeWebSecurity: false,
    pageLoadTimeout: 60000,
    defaultCommandTimeout: 60000,
    experimentalMemoryManagement: true,
    env: {
      db: {
        host: 'private-master-forked-july-db-mysql-tor1-do-user-3590908-0.b.db.ondigitalocean.com',
        user: 'doadmin1',
        password: 'AVNS_vPqSPYleRz97FGbpfXb',
        port: '25060',
        database: 'ca_master'
      },
      ssh: {
        host: '159.203.46.50',
        port: 22,
        user: 'root',
        privateKey: privateKey
      }
    },
  },
});

// SSH Tunnel and MySQL Query Function
function queryTestDb(query, config) {
  const sshConfig = config.env.ssh;
  const dbConfig = config.env.db;
  const sshClient = new Client();

  return new Promise((resolve, reject) => {
    sshClient.on('ready', () => {
      console.log('SSH tunnel established');
      sshClient.forwardOut(
        '127.0.0.1', // Any local port you prefer (e.g., 3307)
        3306, // Dynamic port allocation by SSH server
        dbConfig.host,
        dbConfig.port,
        (err, stream) => {
          if (err) {
            sshClient.end();
            return reject(err);
          }
          const connection = mysql.createConnection({
            host: '127.0.0.1', // Use 'localhost' after tunnel is established
            port: 3306, // Use the dynamically allocated port
            user: dbConfig.user,
            password: dbConfig.password,
            database: dbConfig.database,
            insecureAuth: true,
            stream: stream
          });

          connection.connect(err => {
            if (err) {
              console.error('MySQL connection error:', err);
              sshClient.end();
              return reject(err);
            }
            console.log('Connected to MySQL database');
            connection.query(query, (error, results) => {
              connection.end();
              sshClient.end();
              if (error) return reject(error);
              resolve(results);
            });
          });
        }
      );
    }).connect(sshConfig);
  });
}

