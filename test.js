const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./app');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('API endpoints', () => {
  // Test /checkin endpoint
  describe('POST /checkin', () => {
    it('should record check-in successfully', (done) => {
      chai.request(app)
        .post('/checkin')
        .send({ instructor_id: 1, checkin_time: '9am' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('Check-in recorded successfully');
          done();
        });
    });

    
  });

  // Test /checkout endpoint
  describe('POST /checkout', () => {
    it('should record check-out successfully', (done) => {
      chai.request(app)
        .post('/checkout')
        .send({ instructor_id: 1, checkout_time: '9pm' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('Check-out recorded successfully');
          done();
        });
    });

    
  });

  // Test /monthly-report endpoint
  describe('GET /monthly-report', () => {
    it('should retrieve monthly report successfully', (done) => {
      chai.request(app)
        .get('/monthly-report?month=1&year=2023')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('monthly_report');
          done();
        });
    });

  
  });
});

