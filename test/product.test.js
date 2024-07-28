const request = require("supertest");
const app = require("../index"); // Ensure this path is correct
const { connectDB, disconnectDB } = require("../db"); // Ensure this path is correct
const { expect } = require("chai");
const mongoose = require("mongoose");
let productId;

before(async () => {
  await connectDB();
});

after(async () => {
  await disconnectDB();
});

before(async function () {
  // Drop the database before each test
  await mongoose.connection.db.dropDatabase();
});

describe("Product API", function () {
  it("should create a new product", async function () {
    const response = await request(app)
      .post("/api/product/createproduct")
      .send({
        productid: 1,
        title: "Test Product",
        slug: "test-product",
        description: "This is a test product",
        price: 100,
        category: "Electronics",
        quantity: 10,
        images: [],
        color: ["red"],
        ratings: [],
        brand: "TestBrand",
        sold: 0,
        discount: 10,
        MRP: 120,
        totalratings: 0,
      })
      .set("Accept", "application/json")
      .set("Content-Type", "application/json");
    const responseData = {
      productid: response.body.productid,
      title: response.body.title,
      slug: response.body.slug,
      description: response.body.description,
    };
    productId = response.body._id;
    console.log("response data", responseData);
    console.log("response bd", response.body);
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("_id");
    expect(response.body.title).to.equal("Test Product");
    expect(response.body.sold).to.a("number");
    expect(response.body.discount).to.a("number");
    expect(response.body.MRP).to.a("number");
    expect(response.body).to.have.property("title");
  });

  it("should get a product by ID", async function () {
    const response = await request(app)
      .get(`/api/product/getbyproductid/${productId}`)
      .set("Accept", "application/json");
    console.log("productid",productId)
    expect(response.status).to.equal(200);
   // expect(response.body).to.have.property("title").that.equals("Test Product");
  });
  it("should update a product by ID", async function () {
    const response = await request(app)
      .put(`/api/product/updateproduct/${productId}`)
      .send({
        title: "Updated Test Product",
        price: 150,
      })
      .set("Accept", "application/json")
      .set("Content-Type", "application/json");

    expect(response.status).to.equal(200);
    
  });
  it("should get all products", async function () {
    const response = await request(app)
      .get("/api/product/getallproduct")
      .set("Accept", "application/json");

    expect(response.status).to.equal(200);
    // Ensure that there is at least one product
  });
 
  it("should delete a product by ID", async function () {
    const response = await request(app)
      .delete(`/api/product/deleteproduct/${productId}`)
      .set("Accept", "application/json");

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("message").that.equals("Product deleted successfully");
  });

  it("should not find the deleted product", async function () {
    const response = await request(app)
      .get(`/api/product/getbyproductid/${productId}`)
      .set("Accept", "application/json");

    expect(response.status).to.equal(404); // Assuming 404 is returned for not found products
  });
 
});
