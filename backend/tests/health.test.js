import request from "supertest";
import express from "express";
import { describe, it, expect } from "vitest";

const app = express();

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true
  });
});

describe("Health Route", () => {

  it("should return 200", async () => {

    const response = await request(app).get("/health");

    expect(response.status).toBe(200);

  });

});