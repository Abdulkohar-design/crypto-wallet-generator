const app = require('./app');
const ApiService = require('./services/api.service');

const PORT = process.env.PORT || 3001;

// Initialize API service
const apiService = new ApiService();

// Start server with health check
const startServer = async () => {
  try {
    // Perform health check on startup
    console.log('🔍 Performing startup health checks...');
    const healthStatus = await apiService.checkAllServicesHealth();
    
    console.log('📊 Health Check Results:');
    Object.entries(healthStatus).forEach(([service, status]) => {
      const icon = status.healthy ? '✅' : '❌';
      console.log(`${icon} ${service}: ${status.healthy ? 'OK' : status.error}`);
    });

    // Start the server
    const server = app.listen(PORT, () => {
      console.log('\n🚀 Crypto Wallet Generator Backend Started');
      console.log(`📡 Server running on http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('\n📋 Available Endpoints:');
      console.log(`  • GET  /                                    - API Documentation`);
      console.log(`  • GET  /api/status                          - Server Status`);
      console.log(`  • GET  /api/blockchain/health               - Services Health Check`);
      console.log(`  • GET  /api/blockchain/blockchains          - Supported Blockchains`);
      console.log(`  • GET  /api/blockchain/exchange-rates       - Current Exchange Rates`);
      console.log(`  • GET  /api/blockchain/balance              - Single Balance Check`);
      console.log(`  • POST /api/blockchain/balances             - Multiple Balance Check`);
      console.log(`  • POST /api/blockchain/validate-address     - Address Validation`);
      console.log('\n🔧 Ready to process requests...\n');
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed successfully');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('\n🛑 Received SIGINT, shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed successfully');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the application
startServer();