module.exports = {
    apps : [{
      name: 'asmen_fe(8087/tcp)',
      script: "npm",
      args: "run dev",
      watch: true,
      env: {
         NODE_ENV: "development"
      },
      env_production: {
         NODE_ENV: "production"
      }
    }]
  };

