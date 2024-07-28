const request = require('supertest');
const app = require('../index'); // Ensure this path is correct
const { connectDB, disconnectDB } = require('../db');// Ensure this path is correct
const { expect } = require('chai');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

before(function(done) {
  this.timeout(10000); 
  connectDB().then(done).catch(done);
});

after(function(done) {
  this.timeout(100000); 
  disconnectDB().then(done).catch(done);
});
before(async function() {
  // Drop the database before each test
  await mongoose.connection.db.dropDatabase();
});

describe('User API', () => {

  it('should register a new user', async () => {
   
    const response = await request(app) // Pass the app instance directly
      .post('/api/user/register') // Use relative URL
      .send({
        firstname: 'John',
        lastname: 'Doe',
        password: 'password123',
        email: 'john.doe@example.com',
        mobile: "1234567890"
      }).set('Accept','application/json').set('Content-Type','application/json')
        
      userId = response.body._id;
    
    console.log("userid",userId)
      const responseData = {
        firstname: response.body.firstname,
        lastname: response.body.lastname,
        email: response.body.email,
        mobile: response.body.mobile,
      };
    //   const sampleResponse = {
    //     firstname: 'John',
    //     lastname: 'Doe',
    //     email: 'john.doe@example.com',
    //     mobile: '1234567890'
    //   };
      
    //   console.log('Sample Response Data:', {
    //     firstname: sampleResponse.firstname,
    //     lastname: sampleResponse.lastname,
    //     email: sampleResponse.email,
    //     mobile: sampleResponse.mobile,
    //   });
      
      // Log the response to the console
      console.log('Response:', responseData);
 

    // Check response.end
   
    expect(response.status).to.equal(201);
    expect(response.body.mobile).to.a('string')
    expect(response.body.lastname).to.equal("Doe");
    expect(response.body.email).to.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
  
  });
  

});
