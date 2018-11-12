/*
 * create and export configuration variables
 */

//container fro all the environments
  var environments ={};

// Staging {default} environment
  environments.staging ={
    'httpPort' : 3000,
    'httpsPort': 3001,
    'envName': 'staging'
  };

// Production environments
  environments.production ={
    'httpPort' : 5000,
    'httpsPort': 5001,
    'envName': 'production'
  };

// Determine which enviroment was passed as a command-line argument
  var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
// Check that the current enviroment is one of the enviroments above, if not, default to Staging
  var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;
