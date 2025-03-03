const axios = require('axios');

class Communicator {
  constructor() {
    this.productServiceClient = axios.create({ baseURL: 'http://localhost:5003/api' });
    this.storeServiceClient = axios.create({ baseURL: 'http://localhost:5004/api/product' });
   
  }

  async getStores() {
    const response = await this.storeServiceClient.get('/list-store');
    return response.data;
  }

  async getProducts() {
    const response = await this.productServiceClient.get('/list');
    return response.data;
  }


}

module.exports = new Communicator();